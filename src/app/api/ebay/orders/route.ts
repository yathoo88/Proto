import { NextResponse } from 'next/server';
import { ebayApiClient } from '@/lib/ebay-api/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';
    const filter = searchParams.get('filter') || undefined;

    const data = await ebayApiClient.getOrders({
      limit: parseInt(limit),
      offset: parseInt(offset),
      filter
    });

    const transformedOrders = data.orders?.map((order) => ({
      id: order.orderId,
      customerName: order.buyer?.username || 'Unknown',
      products: order.lineItems?.map((item) => ({
        name: item.title,
        quantity: item.quantity,
        price: parseFloat(item.lineItemCost?.value || '0')
      })) || [],
      total: parseFloat(order.pricingSummary?.total?.value || '0'),
      platform: 'eBay',
      status: mapOrderStatus(order.orderFulfillmentStatus),
      fees: calculateEbayFees(order),
      profit: calculateProfit(order),
      date: new Date(order.creationDate),
      paymentStatus: order.orderPaymentStatus,
      shippingStatus: order.shippingFulfillments?.[0]?.shipmentTrackingNumber ? 'Shipped' : 'Pending'
    })) || [];

    return NextResponse.json({
      orders: transformedOrders,
      total: data.total || 0,
      limit: data.limit || parseInt(limit),
      offset: data.offset || parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching eBay orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders from eBay' },
      { status: 500 }
    );
  }
}

function mapOrderStatus(fulfillmentStatus: string): string {
  const statusMap: { [key: string]: string } = {
    'NOT_STARTED': 'Pending',
    'IN_PROGRESS': 'Processing',
    'FULFILLED': 'Shipped',
    'CANCELLED': 'Cancelled'
  };
  return statusMap[fulfillmentStatus] || 'Unknown';
}

function calculateEbayFees(order: {
  pricingSummary?: {
    total?: { value?: string };
    fee?: { value?: string };
  };
}): number {
  const total = parseFloat(order.pricingSummary?.total?.value || '0');
  const finalValueFee = total * 0.1325;
  const paymentProcessingFee = total * 0.029;
  
  const actualFees = order.pricingSummary?.fee?.value 
    ? parseFloat(order.pricingSummary.fee.value)
    : finalValueFee + paymentProcessingFee;
    
  return actualFees;
}

function calculateProfit(order: {
  pricingSummary?: {
    total?: { value?: string };
    fee?: { value?: string };
  };
}): number {
  const total = parseFloat(order.pricingSummary?.total?.value || '0');
  const fees = calculateEbayFees(order);
  const estimatedCost = total * 0.6;
  
  return total - fees - estimatedCost;
}