export interface Account {
  readonly id: number;
  bank_code: string;
  readonly account_name: string;
  account_number: string;
  recipient_code: string;
  wallet_id: number;
  user_id: number;
  readonly created_at: Date;
  readonly updated_at: Date;
}
