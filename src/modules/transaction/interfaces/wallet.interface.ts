export interface Wallet {
  id: number;
  tag: string;
  currentBalance: number;
  user_id: number;
  readonly created_at: Date;
  readonly updated_at: Date;
}
