export interface Transaction {
  readonly id: number;
  amount: number;
  reference: string;
  currency: string;
  status: string;
  mode: string;
  type: string;
  user_id: number;
  wallet_id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
