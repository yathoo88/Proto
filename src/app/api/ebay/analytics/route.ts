import { NextResponse } from 'next/server';
import { ebayApiClient } from '@/lib/ebay-api/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const metricName = searchParams.get('metric_name') || 'LISTING_VIEWS_TOTAL';
    const dateRange = searchParams.get('date_range') || 'LAST_30_DAYS';
    const dimension = searchParams.get('dimension') || undefined;

    const data = await ebayApiClient.getAnalytics({
      metric_name: metricName,
      date_range: dateRange,
      dimension
    });

    const transformedData = {
      metrics: data.records?.map((record) => ({
        date: record.startDate,
        value: record.metricValues?.[0]?.value || 0,
        dimension: record.dimensionValues?.[0]?.value || null
      })) || [],
      metricName,
      dateRange,
      total: data.records?.reduce((sum: number, record) => 
        sum + (record.metricValues?.[0]?.value || 0), 0) || 0
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching eBay analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics from eBay' },
      { status: 500 }
    );
  }
}