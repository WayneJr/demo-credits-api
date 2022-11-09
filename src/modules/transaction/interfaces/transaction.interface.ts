export interface Transaction {
  readonly id: number;
  amount: number;
  reference: string;
  currency: string;
  status: string;
  mode: string;
  type: string;
  userId: number;
  walletId: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
