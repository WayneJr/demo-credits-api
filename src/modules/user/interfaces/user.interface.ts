export interface User {
  id: number;
  firstName: string;
  lastName: string;
  tag: string;
  transactionPin: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
