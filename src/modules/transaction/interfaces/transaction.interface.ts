export interface Transaction {
  readonly id: number;
  amount: number;
  reference: string;
  currency: string;
  status: string;
  mode: string;
  type: string;
  userId: number;
  wallet_id: number;
  readonly created_at: Date;
  readonly updated_at: Date;
}
