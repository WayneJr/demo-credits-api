# DemoCredits Wallet API

## Description

  <p align="center">A Demo mvp API for a wallet system that a user can sign up, add their account Numbers, fund their wallet, transfer from one user's wallet to the other and also withdraw from their wallet.
  This demo is <strong>HOSTED</strong> <a href="https://uchechukwu-ahunanya-lendsqr-be-test.fly.dev">here</a> 
  while the <strong>DOCUMENTATION</strong> can be found <a href="https://documenter.getpostman.com/view/10955476/2s8YemutyR">here</a>

  </p>


## E-R Diagram

<p align="center">
  <img src="https://res.cloudinary.com/fellyr/image/upload/v1668087528/ERdiagramDemoCredits.png" width="5000" alt="Nest Logo" />
</p>


## Installation

Please ensure to add this `https://your-hostname/api/v1/transactions/verify/deposit` url in the **WEBHOOK URL** field os your paystack dashboard to enable automation of the process.

```bash
$ yarn install
```

## Running the app

Please fill in your mysql database configuration details in a `dev.env`  file and place it in the `src/config/env` directory of the project. This will be for your development use. For production, please name the file `prod.env`.

**NOTE**: There is a sample of what your `.env` file should look like in the `.env.example` file.

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Migrations
```bash
# up
$ yarn mig:up

# down
$ yarn mig:down

# latest
$ yarn mig:latest
```

## Test

```bash
# unit tests
$ yarn test

```

## Deployment 
This app was deployed using [Fly](https://fly.io)

## Stay in touch

- Author - [Uchechukwu Ahunanya](https://github.com/WayneJr)
- Twitter - [@thatdancingdev](https://twitter.com/thatdancingdev)

## License

Nest is [MIT licensed](LICENSE).
