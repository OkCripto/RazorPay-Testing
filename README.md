# Razorpay Integration Demo (Next.js + Tailwind CSS)

### 🔗 [Test the App on Vercel](https://razor-pay-testing.vercel.app)

A minimal, state-of-the-art dark-themed application to test Razorpay payment gateway integration.

## Features
- **Modern UI**: Sleek dark theme with glassmorphism and smooth animations.
- **Amount Selection**: Choose from preset amounts (100, 500, 1000) or enter a custom amount.
- **Razorpay Integration**: Fully functional checkout flow (Order creation -> Verification).
- **TypeScript**: Typed implementation for better reliability.

## Setup Instructions

### 1. Cloned/Created the project
The project is already set up in this directory.

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory (one has been created for you with placeholders) and add your Razorpay credentials:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_SECRET=xxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxx
```

You can get these keys from your [Razorpay Dashboard](https://dashboard.razorpay.com/app/dashboard) in **Settings > API Keys**.

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure
- `src/app/api/razorpay/order/route.ts`: Backend route to create a Razorpay order.
- `src/app/api/razorpay/verify/route.ts`: Backend route to verify payment signatures.
- `src/app/page.tsx`: Main UI with payment logic and amount selection.
- `src/app/globals.css`: Custom dark theme and glassmorphism styles.

## Testing
1. Select an amount.
2. Click the "Pay" button.
3. The Razorpay checkout modal will appear.
4. Use [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/) to complete the transaction.

## Disclaimer
This is for test purposes only. Ensure you use your **Test Mode** API keys from Razorpay.
