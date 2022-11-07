const development = {
  PORT: 3000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || 'mysql',
  DB_NAME: process.env.DB_NAME || 'mysql',
  TOKEN:
    process.env.TOKEN ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXh0IjoiNjJiZGY0MWNhNGEzMWJkZTk3ZmMzOTNlIiwiaWF0IjoxNjU2NjE1OTY0LCJleHAiOjE2NTY3MDIzNjR9.Rxx0VO5MOaOTtvsgKJ3Z7IWfl6Lo2B373p2plYdG6oc',
};

export default development;
