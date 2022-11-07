import { registerAs } from '@nestjs/config';
import { PROD, TEST } from '../core/constants';
import development from './env-dev';
import production from './env-prod';
import test from './env-test';

export default () => {
  if (process.env.NODE_ENV === PROD) {
    return production;
  } else if (process.env.NODE_ENV === TEST) return test;
  else return development;
};
