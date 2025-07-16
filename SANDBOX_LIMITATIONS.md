# eBay Sandbox API Limitations

## Overview

The eBay Sandbox environment has several limitations compared to the production environment. This document explains these limitations and how our application handles them.

## API Limitations in Sandbox

### 1. Fulfillment API (Orders)
- **Issue**: The Fulfillment API requires an active seller account with actual orders
- **Sandbox Limitation**: No real orders exist in the sandbox environment
- **Our Solution**: When the Fulfillment API returns 403 Forbidden, we automatically fall back to using the Browse API to fetch listings and transform them into mock order data

### 2. Available APIs in Sandbox

#### ✅ Working APIs:
- **Browse API**: Search and view items (we use this as fallback)
- **Finding API**: Search for items
- **Trading API**: Limited functionality

#### ❌ Limited/Not Available:
- **Fulfillment API**: Requires real seller account
- **Inventory API**: Requires active inventory
- **Analytics API**: Requires real transaction data
- **Finance API**: Requires real financial data

## How We Handle This

1. **Automatic Fallback**: When Fulfillment API fails with 403, we automatically use Browse API
2. **Mock Data Transformation**: Browse API listings are transformed to look like orders
3. **Realistic Data**: Generated order data includes:
   - Random order IDs
   - Simulated buyer usernames
   - Calculated fees (13.25% eBay fee)
   - Random order statuses
   - Simulated dates

## For Production

When moving to production:
1. Use production App ID and Client Secret
2. All APIs will work with real data
3. Remove the fallback logic if desired
4. Ensure proper seller account permissions

## Testing in Sandbox

To test the application in sandbox:
1. The app will automatically handle API limitations
2. You'll see simulated order data based on eBay listings
3. All calculations (fees, profits) work the same as production
4. Toggle to "Mock 데이터" if you prefer local test data