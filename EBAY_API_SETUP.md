# eBay API Setup Guide

## Prerequisites

To use the eBay API integration, you need to obtain your Client Secret from the eBay Developer Program.

## Steps to Get Your Client Secret

1. Go to [eBay Developer Program](https://developer.ebay.com/)
2. Sign in with your developer account
3. Navigate to "My Account" → "Application Keys"
4. Find your Sandbox App (HeeseonY-s-SBX-60bc7982c-45bc22b6)
5. Copy your **Client Secret (Cert ID)**

## Configuration

1. Open `.env.local` file in the project root
2. Replace `YOUR_CLIENT_SECRET_HERE` with your actual Client Secret:

```bash
EBAY_SANDBOX_CLIENT_SECRET=your-actual-client-secret-here
```

## Important Notes

- **Never commit your Client Secret to version control**
- The `.env.local` file is already in `.gitignore` to prevent accidental commits
- Make sure to keep your Client Secret secure
- For production, use production keys instead of sandbox keys

## Troubleshooting

If you see "Failed to get access token: Unauthorized" error:
1. Double-check your Client Secret is correct
2. Ensure there are no extra spaces or characters
3. Verify your App ID matches the one in eBay Developer Dashboard

## Using Mock Data

If you don't have API credentials yet, you can toggle to use mock data:
- In the Orders page, click "Mock 데이터 사용" button
- In the Pricing page, click "Mock 데이터 사용" button

This allows you to test the application without API credentials.