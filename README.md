# Tiny Bank Assessment 2.0

## Tecnologies

- NodeJs v20.9
- NestJs Framework

## Instrunctions to run

```sh
npm i
pnpm start
```

\*`npm i` only required first time

### Tests

```sh
pnpm test
```

### Requests

\* There is a swagger basic document that can be used to test the api at `http://localhost:5000/swagger`.

- User creation

  - `POST http://localhost:5000`
  - `Content-Type: application/json`

  - Body:
    ```json
    {
      "name": "[NAME]",
      "email": "[EMAIL]"
    }
    ```

- User deactivation

  - `PATCH http://localhost:5000/users/deactivate`
  - `Content-Type: application/json`

  - Body:
    ```json
    {
      "email": "[EMAIL]"
    }
    ```

- Get all active users

  - `GET http://localhost:5000/users`

- Get all user's account

  - `GET http://localhost:5000/accounts/[EMAIL]`

- Deposit

  - `POST http://localhost:5000/accounts/deposit`
  - `Content-Type: application/json`

  - Body:
    ```json
    {
      "accountNumber": "[ACCOUNT_NUMBER]",
      "amount": 1000
    }
    ```

- Withdraw

  - `POST http://localhost:5000/accounts/withdraw`
  - `Content-Type: application/json`

  - Body:
    ```json
    {
      "accountNumber": "[ACCOUNT_NUMBER]",
      "amount": 500
    }
    ```

- Transfer

  - `POST http://localhost:5000/accounts/transfer`
  - `Content-Type: application/json`

  - Body:
    ```json
    {
      "fromAccountNumber": "[ACCOUNT_NUMBER_FROM_WITHDRAW]",
      "toAccountNumber": "[ACCOUNT_NUMBER_FOR_DEPOSIT]",
      "amount": 500
    }
    ```

- Balance

  - `POST http://localhost:5000//accounts/balance/[ACCOUNT_NUMBER]`

- History
  - `POST http://localhost:5000//accounts/balance/[ACCOUNT_NUMBER]`

There are few other requests could be helpful to get user or account states, those can be found into `tiny-bank.request.http` file.

### Trade-offs

- I decided to use nodejs instead of .NET, because this is the tecnology I've been using last 2 years
- For test porpouses the email field is the "unique key"
- There are some valitions missing like request fields, etc
- The user can include multiple accounts, actually the transfer can be done between user accounts
