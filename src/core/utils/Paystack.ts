import * as axios from 'axios';
import { PAYSTACK_CURRENCY } from 'src/core/constants';
import {
  PAYSTACK_AUTH,
  PAYSTACK_CONTENT_STRING,
  PAYSTACK_CONTENT_TYPE,
  PAYSTACK_HOSTNAME,
  PAYSTACK_RESOLVE_ACCOUNT,
  PAYSTACK_TRANSACTION_PATH,
} from '../constants';
import {
  CreateRecipientResponse,
  InitializePaymentResponse,
  ResolveAccountResponse,
} from './interfaces/paystack.interface';
import { v4 as uuidv4 } from 'uuid';

/**
 * @class Paystack
 * @description A class that handles all Paystack related operations
 * @exports Paystack
 */
export class Paystack {
  private static axiosInstance = axios.default.create({
    baseURL: `https://${PAYSTACK_HOSTNAME}`,
    headers: {
      Authorization: PAYSTACK_AUTH,
      [`${PAYSTACK_CONTENT_STRING}`]: PAYSTACK_CONTENT_TYPE,
    },
  });

  /**
   * Initiate a payment to the paystack API
   * @param Object containing the amount, email
   * @returns
   */
  static async initializeTransaction({
    amount,
    email,
  }: {
    amount: number;
    email: string;
  }): Promise<InitializePaymentResponse> {
    const url = `/${PAYSTACK_TRANSACTION_PATH}`;
    const data = {
      amount,
      email,
    };
    const response = await this.axiosInstance.post(url, data);
    return response.data;
  }

  /**
   * Resolve account number
   * @param accountNumber
   * @param bankCode
   * @returns
   */

  static async resolveAccountNumber(
    accountNumber: string,
    bankCode: string,
  ): Promise<ResolveAccountResponse> {
    const url = `${PAYSTACK_RESOLVE_ACCOUNT}?account_number=${accountNumber}&bank_code=${bankCode}`;

    const response = await this.axiosInstance.get(url);
    return response.data;
  }

  static async getBanks() {
    const url = `/bank?currenct=NGN`;
    const response = await this.axiosInstance.get(url);
    return response.data;
  }

  static async createRecipient({
    name,
    accountNumber,
    bankCode,
  }): Promise<CreateRecipientResponse> {
    const url = `/transferrecipient`;
    const data = {
      type: 'nuban',
      name: name,
      account_number: accountNumber,
      bank_code: bankCode,
      currency: PAYSTACK_CURRENCY,
    };
    const response = await this.axiosInstance.post(url, data);
    return response.data;
  }

  static async initiateTransfer({
    amount,
    recipient,
  }): Promise<InitializePaymentResponse> {
    const url = `/transfer`;

    const ref = uuidv4();
    console.log(ref);
    const data = {
      source: 'balance',
      amount,
      reference: ref,
      recipient,
      reason: 'Withdrawal From wallet',
    };
    const response = await this.axiosInstance.post(url, data);
    return response.data;
  }
}
