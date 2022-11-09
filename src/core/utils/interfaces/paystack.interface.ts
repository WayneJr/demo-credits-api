/* eslint-disable @typescript-eslint/no-empty-interface */
interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

interface PaystackEvent<T> {
  event: string;
  data: T;
}

export interface InitializePaymentPayload {
  amount: number;
  email: string;
  userId: string;
  reference: string;
  initialCharge?: boolean;
  meta?: Record<string, any>;
}

export interface InitializePaymentData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface InitializePaymentResponse
  extends PaystackResponse<InitializePaymentData> {}

export interface WebhookAuthorization {
  reference: string;
  status: string;
  paid_at: string;
  metadata: {
    userId: string;
    tokenization?: boolean;
  };
  amount: number;
  customer: {
    email: string;
  };
  authorization: {
    bin: string;
    bank: string;
    last4: string;
    channel: string;
    exp_year: string;
    card_type: string;
    exp_month: string;
    signature: string;
    reusable: boolean;
    country_code: string;
    account_name: string;
    authorization_code: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WebhookPayload extends PaystackEvent<WebhookAuthorization> {}
