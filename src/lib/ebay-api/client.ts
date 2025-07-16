// Singleton token storage to persist across requests
let cachedToken: { token: string; expiry: number } | null = null;

export class EbayApiClient {
  private appId: string;
  private clientSecret: string;
  private environment: string;
  private baseUrl: string;

  constructor() {
    this.appId = process.env.EBAY_SANDBOX_APP_ID || '';
    this.clientSecret = process.env.EBAY_SANDBOX_CLIENT_SECRET || '';
    this.environment = process.env.EBAY_SANDBOX_ENVIRONMENT || 'SANDBOX';
    this.baseUrl = process.env.EBAY_API_BASE_URL || 'https://api.sandbox.ebay.com';
    
    // Check if credentials are properly configured
    if (!this.appId || !this.clientSecret || this.clientSecret === 'YOUR_CLIENT_SECRET_HERE') {
      console.warn('eBay API credentials not properly configured. Please update .env.local with your Client Secret.');
    }
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid cached token that hasn't expired
    if (cachedToken && Date.now() < cachedToken.expiry) {
      return cachedToken.token;
    }

    // Check if credentials are configured
    if (!this.appId || !this.clientSecret || this.clientSecret === 'YOUR_CLIENT_SECRET_HERE') {
      throw new Error('eBay API credentials not configured. Please add your Client Secret to .env.local');
    }

    const authUrl = process.env.EBAY_AUTH_URL || 'https://api.sandbox.ebay.com/identity/v1/oauth2/token';
    
    // For Sandbox, we can only use basic public scope
    // Production environment would support more scopes
    const scopes = this.environment === 'SANDBOX' 
      ? 'https://api.ebay.com/oauth/api_scope'
      : [
          'https://api.ebay.com/oauth/api_scope',
          'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly',
          'https://api.ebay.com/oauth/api_scope/sell.analytics.readonly'
        ].join(' ');
    
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      scope: scopes
    });

    const credentials = Buffer.from(`${this.appId}:${this.clientSecret}`).toString('base64');

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
        const errorText = await response.text();
        console.error('eBay Auth Error Response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          requestScopes: scopes
        });
        
        // Parse error response if it's JSON
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(`eBay Auth failed: ${errorData.error_description || errorData.error || response.statusText}`);
        } catch (e) {
          throw new Error(`Failed to get access token: ${response.statusText} - ${errorText}`);
        }
      }

      const data = await response.json();
      
      // Cache token with expiry (usually 2 hours, but we'll refresh after 1.5 hours to be safe)
      cachedToken = {
        token: data.access_token,
        expiry: Date.now() + ((data.expires_in || 7200) - 1800) * 1000
      };
      
      console.log('eBay token obtained successfully, expires in', data.expires_in, 'seconds');
      
      return cachedToken.token;
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
    // In Sandbox, always use Browse API to simulate orders
    if (this.environment === 'SANDBOX') {
      console.log('Using Browse API for Sandbox orders');
      const listings = await this.getListings({ limit: params?.limit });
      
      return {
        orders: listings.itemSummaries?.map((item: any, index: number) => {
          const price = parseFloat(item.price?.value || '0');
          const quantity = Math.floor(Math.random() * 3) + 1;
          const total = price * quantity;
          const fee = total * 0.1325; // eBay fee 13.25%
          
          return {
            orderId: `SANDBOX-${Date.now()}-${index}`,
            buyer: { username: `buyer_${Math.floor(Math.random() * 1000)}` },
            lineItems: [{
              title: item.title,
              quantity: quantity,
              lineItemCost: { value: price.toString() }
            }],
            pricingSummary: {
              total: { value: total.toFixed(2) },
              fee: { value: fee.toFixed(2) }
            },
            orderFulfillmentStatus: ['NOT_STARTED', 'IN_PROGRESS', 'FULFILLED'][Math.floor(Math.random() * 3)],
            creationDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            orderPaymentStatus: 'PAID',
            shippingFulfillments: Math.random() > 0.5 ? [{ shipmentTrackingNumber: `TRACK${Math.floor(Math.random() * 999999)}` }] : []
          };
        }) || [],
        total: listings.total || 0,
        limit: params?.limit || 50,
        offset: params?.offset || 0
      };
    }
    
    // Production code would use the real Fulfillment API
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
    // In Sandbox, always return mock analytics data
    if (this.environment === 'SANDBOX') {
      console.log('Using mock analytics data for Sandbox environment');
      const days = params.date_range === 'LAST_7_DAYS' ? 7 : 30;
      
      return {
        records: Array.from({ length: days }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1 - i));
          
          // Generate realistic looking data with trends
          const baseValue = 500;
          const trend = i * 10; // Upward trend
          const randomVariation = Math.floor(Math.random() * 200) - 100;
          const value = Math.max(50, baseValue + trend + randomVariation);
          
          return {
            startDate: date.toISOString().split('T')[0],
            metricValues: [{ value }],
            dimensionValues: params.dimension ? [{ value: 'EBAY_US' }] : undefined
          };
        })
      };
    }
    
    // Production code would use the real Analytics API
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