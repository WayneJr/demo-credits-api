import { Injectable } from '@nestjs/common';
import * as axios from 'axios';
import {
  PAYSTACK_AUTH,
  PAYSTACK_CALLBACK_URL,
  PAYSTACK_CONTENT_STRING,
  PAYSTACK_CONTENT_TYPE,
  PAYSTACK_HOSTNAME,
  PAYSTACK_TRANSACTION_PATH,
  PAYSTACK_VERIFY_TRANSACTION_PATH,
} from '../constants';
import { InitializePaymentResponse } from './interfaces/paystack.interface';

export class Paystack {
  private static axiosInstance = axios.default.create({
    baseURL: `https://${PAYSTACK_HOSTNAME}`,
    headers: {
      Authorization: PAYSTACK_AUTH,
      [`${PAYSTACK_CONTENT_STRING}`]: PAYSTACK_CONTENT_TYPE,
    },
  });

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

  static async verifyTransaction(reference: string) {
    const url = `/${PAYSTACK_VERIFY_TRANSACTION_PATH}/${reference}`;

    const response = await this.axiosInstance.get(url);
    return response.data;
  }
}
