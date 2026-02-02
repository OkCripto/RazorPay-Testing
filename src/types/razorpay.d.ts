export {};

declare module "razorpay" {
  export default class Razorpay {
    constructor(options: { key_id: string; key_secret: string });
    orders: {
      create(options: {
        amount: number;
        currency: string;
        receipt?: string;
        notes?: Record<string, unknown>;
      }): Promise<Record<string, unknown>>;
    };
  }
}

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

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): {
        open(): void;
      };
    };
  }
}
