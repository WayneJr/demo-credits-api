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

export interface RecipientDetails {
  authorization_code: any;
  account_number: string;
  account_name: any;
  bank_code: string;
  bank_name: string;
}

export interface TransferRecipientData {
  active: boolean;
  createdAt: Date;
  currency: string;
  domain: string;
  id: number;
  integration: number;
  name: string;
  recipient_code: string;
  type: string;
  updatedAt: string;
  is_deleted: boolean;
  details: RecipientDetails;
}

export interface CreateRecipientResponse
  extends PaystackResponse<TransferRecipientData> {}

export interface InitializePaymentPayload {
  amount: number;
  email: string;
  userId: string;
  reference: string;
  initialCharge?: boolean;
  meta?: Record<string, any>;
}

export interface ResolveAccountData {
  account_number: string;
  account_name: string;
  bank_id: number;
}

export interface ResolveAccountResponse
  extends PaystackResponse<ResolveAccountData> {}

export interface InitiateTransferData {
  reference: string;
  integration: number;
  domain: string;
  amount: number;
  currency: string;
  source: string;
  reason: string;
  recipient: number;
  status: string;
  transfer_code: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InitiateTransferResponse
  extends PaystackResponse<InitiateTransferData> {}

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
