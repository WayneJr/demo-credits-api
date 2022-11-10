const PAYSTACK_HOSTNAME = 'api.paystack.co';
const PAYSTACK_PORT = 443;
const PAYSTACK_POST_METHOD = 'POST';
const PAYSTACK_TRANSACTION_PATH = 'transaction/initialize';
const PAYSTACK_VERIFY_TRANSACTION_PATH = 'transaction/verify';
const PAYSTACK_NUBAN = 'nuban';
const PAYSTACK_CURRENCY = 'NGN';
const PAYSTACK_BALANCE = 'balance';
const PAYSTACK_TRANSACTION_REFUND_PATH = '/refund';
const PAYSTACK_TRANSACTION_CHARGE_PATH = '/transaction/charge_authorization';
const PAYSTACK_RECIPIENT = '/transferrecipient';
const PAYSTACK_FINALIZE = '/transfer/finalize_transfer';
const PAYSTACK_AUTH = `Bearer ${process.env.PAYSTACK_SECRET}`;
const PAYSTACK_CONTENT_STRING = 'Content-Type';
const PAYSTACK_CONTENT_TYPE = 'application/json';
const PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL;
const TRANS_TYPE_CARD = 'addCard';
const TRANS_CARD_AMOUNT = 10000;
const OK = 200;
const PAYSTACK_BANKS = '/bank?country=nigeria';
const PAYSTACK_RESOLVE_ACCOUNT = '/bank/resolve';
const PAYSTACK_TRANSFER_RECIPIENT = '/transferrecipient';
const PAYSTACK_TRANSFER = '/transfer';

// Payment options
const CARD = 'card';
const BANK = 'bank';
const REMITA = 'remita';
const NIBSS = 'nibss';
const PAYSTACK = 'paystack';

// Get Accounts ID types
const USERID = 'userId';
const WALLETID = 'wallet_id';

// Transaction Status
const PENDING = 'pending';
const PROCESSING = 'processing';
const FAILED = 'failed';
const SUCCESS = 'success';
// Transaction Type
const DEBIT = 'debit';
const CREDIT = 'credit';

// Transaction mode
const WALLET = 'wallet';
const DEPOSIT = 'deposit';
const WITHDRAW = 'withdraw';

// Http Methods
const GET = 'get';
const POST = 'post';
const PATCH = 'patch';
const PUT = 'put';
const DELETE = 'delete';

// Environment States
const DEV = 'dev';
const PROD = 'prod';
const TEST = 'test';

// Providers
const USER_SERVICE = 'USER_SERVICE';
const TRANSACTION_SERVICE = 'TRANSACTION_SERVICE';
const ACCOUNT_SERVICE = 'ACCOUNT_SERVICE';

export {
  PAYSTACK_HOSTNAME,
  PAYSTACK_PORT,
  PAYSTACK_POST_METHOD,
  PAYSTACK_TRANSACTION_PATH,
  PAYSTACK_VERIFY_TRANSACTION_PATH,
  PAYSTACK_RECIPIENT,
  PAYSTACK_CURRENCY,
  PAYSTACK_FINALIZE,
  PAYSTACK_NUBAN,
  PAYSTACK_BALANCE,
  PAYSTACK_AUTH,
  PAYSTACK_CONTENT_STRING,
  PAYSTACK_CONTENT_TYPE,
  PAYSTACK_CALLBACK_URL,
  PAYSTACK_TRANSACTION_REFUND_PATH,
  PAYSTACK_TRANSACTION_CHARGE_PATH,
  TRANS_CARD_AMOUNT,
  TRANS_TYPE_CARD,
  OK,
  PAYSTACK_BANKS,
  PAYSTACK_RESOLVE_ACCOUNT,
  PAYSTACK_TRANSFER_RECIPIENT,
  PAYSTACK_TRANSFER,
  CARD,
  BANK,
  REMITA,
  NIBSS,
  PAYSTACK,
  DEPOSIT,
  WITHDRAW,
  WALLET,
  PENDING,
  PROCESSING,
  FAILED,
  SUCCESS,
  CREDIT,
  DEBIT,
  GET,
  POST,
  PATCH,
  PUT,
  DELETE,
  DEV,
  PROD,
  TEST,
  USER_SERVICE,
  TRANSACTION_SERVICE,
  ACCOUNT_SERVICE,
  USERID,
  WALLETID,
};
