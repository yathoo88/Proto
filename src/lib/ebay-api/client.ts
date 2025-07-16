export class EbayApiClient {
  private appId: string;
  private environment: string;
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor() {
    this.appId = process.env.EBAY_SANDBOX_APP_ID || '';
    this.environment = process.env.EBAY_SANDBOX_ENVIRONMENT || 'SANDBOX';
    this.baseUrl = process.env.EBAY_API_BASE_URL || 'https://api.sandbox.ebay.com';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    const authUrl = process.env.EBAY_AUTH_URL || 'https://api.sandbox.ebay.com/identity/v1/oauth2/token';
    
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'https://api.ebay.com/oauth/api_scope'
    });

    const credentials = Buffer.from(`${this.appId}:`).toString('base64');

    try {
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`
        },
        body: params.toString()
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      
      return this.accessToken;
    } catch (error) {
      console.error('Error getting eBay access token:', error);
      throw error;
    }
  }

  async getOrders(params?: {
    limit?: number;
    offset?: number;
    filter?: string;
  }): Promise<{
    orders?: Array<{
      orderId: string;
      buyer?: { username: string };
      lineItems?: Array<{
        title: string;
        quantity: number;
        lineItemCost?: { value: string };
      }>;
      pricingSummary?: {
        total?: { value: string };
        fee?: { value: string };
      };
      orderFulfillmentStatus: string;
      creationDate: string;
      orderPaymentStatus: string;
      shippingFulfillments?: Array<{ shipmentTrackingNumber?: string }>;
    }>;
    total?: number;
    limit?: number;
    offset?: number;
  }> {
    const token = await this.getAccessToken();
    
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.filter) queryParams.append('filter', params.filter);

    const url = `${this.baseUrl}/sell/fulfillment/v1/order${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching eBay orders:', error);
      throw error;
    }
  }

  async getOrder(orderId: string): Promise<unknown> {
    const token = await this.getAccessToken();
    const url = `${this.baseUrl}/sell/fulfillment/v1/order/${orderId}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching eBay order:', error);
      throw error;
    }
  }

  async getInventoryItems(params?: {
    limit?: number;
    offset?: number;
  }): Promise<unknown> {
    const token = await this.getAccessToken();
    
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const url = `${this.baseUrl}/sell/inventory/v1/inventory_item${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch inventory items: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching eBay inventory:', error);
      throw error;
    }
  }

  async getListings(params?: {
    limit?: number;
    offset?: number;
    q?: string;
  }): Promise<{
    itemSummaries?: Array<{
      itemId: string;
      title: string;
      price?: { value: string };
      estimatedAvailabilities?: Array<{ estimatedAvailableQuantity: number }>;
      itemCreationDate?: string;
      image?: { imageUrl: string };
      condition?: string;
      itemLocation?: { country: string };
      shippingOptions?: unknown;
      categories?: unknown;
      itemWebUrl?: string;
    }>;
    total?: number;
    limit?: number;
    offset?: number;
  }> {
    const token = await this.getAccessToken();
    
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.q) queryParams.append('q', params.q);

    const url = `${this.baseUrl}/buy/browse/v1/item_summary/search${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch listings: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching eBay listings:', error);
      throw error;
    }
  }

  async getAnalytics(params: {
    metric_name: string;
    date_range?: string;
    dimension?: string;
  }): Promise<{
    records?: Array<{
      startDate: string;
      metricValues?: Array<{ value: number }>;
      dimensionValues?: Array<{ value: string }>;
    }>;
  }> {
    const token = await this.getAccessToken();
    
    const queryParams = new URLSearchParams({
      metric_name: params.metric_name
    });
    if (params.date_range) queryParams.append('date_range', params.date_range);
    if (params.dimension) queryParams.append('dimension', params.dimension);

    const url = `${this.baseUrl}/sell/analytics/v1/traffic_report${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching eBay analytics:', error);
      throw error;
    }
  }
}

export const ebayApiClient = new EbayApiClient();