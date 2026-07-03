declare module '@paystack/inline-js' {
  export default class PaystackPop {
    constructor();
    newTransaction(options: {
      key: string;
      email: string;
      amount: number;
      currency?: string;
      ref?: string;
      metadata?: any;
      onSuccess?: (transaction: any) => void;
      onCancel?: () => void;
      onLoad?: () => void;
    }): void;
  }
}
