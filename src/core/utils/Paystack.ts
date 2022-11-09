import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  PAYSTACK_CONTENT_STRING,
  PAYSTACK_CONTENT_TYPE,
  PAYSTACK_TRANSACTION_PATH,
  PAYSTACK_VERIFY_TRANSACTION_PATH,
} from '../constants';

@Injectable()
export class Paystack {
  private static options = {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      [`${PAYSTACK_CONTENT_STRING}`]: PAYSTACK_CONTENT_TYPE,
    },
  };

  static async initializeTransaction({
    amount,
    email,
  }: {
    amount: number;
    email: string;
  }) {
    const url = `${process.env.PAYSTACK_HOSTNAME}/${PAYSTACK_TRANSACTION_PATH}`;
    const data = {
      amount,
      email,
    };
    const response = await axios.post(url, data, this.options);
    return response.data;
  }

  static async verifyTransaction(reference: string) {
    const url = `${process.env.PAYSTACK_HOSTNAME}/${PAYSTACK_VERIFY_TRANSACTION_PATH}/${reference}`;

    const response = await axios.get(url, this.options);
    return response.data;
  }
}
