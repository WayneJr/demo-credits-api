export interface Wallet {
  id: number;
  tag: string;
  currentBalance: number;
  previousBalance: number;
  userId: number;
  readonly created_at: Date;
  readonly updated_at: Date;
}
