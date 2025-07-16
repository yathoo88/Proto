import { NextResponse } from 'next/server';
import { ebayApiClient } from '@/lib/ebay-api/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';
    const q = searchParams.get('q') || undefined;

    const data = await ebayApiClient.getListings({
      limit: parseInt(limit),
      offset: parseInt(offset),
      q
    });

    const transformedListings = data.itemSummaries?.map((item) => ({
      id: item.itemId,
      name: item.title,
      currentPrice: parseFloat(item.price?.value || '0'),
      costPrice: parseFloat(item.price?.value || '0') * 0.6,
      stock: item.estimatedAvailabilities?.[0]?.estimatedAvailableQuantity || 0,
      supplier: 'eBay Seller',
      platform: 'eBay',
      lastUpdated: new Date(item.itemCreationDate || Date.now()),
      image: item.image?.imageUrl,
      condition: item.condition,
      location: item.itemLocation?.country,
      shippingOptions: item.shippingOptions,
      categories: item.categories,
      itemWebUrl: item.itemWebUrl
    })) || [];

    return NextResponse.json({
      listings: transformedListings,
      total: data.total || 0,
      limit: data.limit || parseInt(limit),
      offset: data.offset || parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching eBay listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings from eBay' },
      { status: 500 }
    );
  }
}