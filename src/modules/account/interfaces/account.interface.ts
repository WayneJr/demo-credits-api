export interface Account {
  readonly id: number;
  bankCode: string;
  readonly accountName: string;
  accountNumber: string;
  recipientCode: string;
  walletId: number;
  userId: number;
  readonly created_at: Date;
  readonly updated_at: Date;
}
