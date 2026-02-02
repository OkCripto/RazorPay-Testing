interface RazorpayOptions {
  key: string;
  amount: number | string;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

class Razorpay {
  constructor(options: RazorpayOptions);
  open(): void;
}

interface Window {
  Razorpay: typeof Razorpay;
}
