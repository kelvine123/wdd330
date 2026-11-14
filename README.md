# Kelvine | SleepOutside

SleepOutside is a Kenya-focused outdoor gear shop. The catalog combines tents, sleeping bags, and backpacks, with prices displayed in Kenyan shillings.

## Run locally

Install Node.js and dependencies, then run:

```sh
npm install
npm run dev
```

Open `http://localhost:5173/`. Without `DATABASE_URL`, local development reads the checked-in catalog files. With a PostgreSQL connection configured, the API initializes the database and imports the catalog on startup.

## Catalog and currency

The catalog contains 94 products from `src/public/json/`. The backend normalizes those records and stores them in PostgreSQL. Prices are converted once from USD using the user-provided fixed rate of **1 USD = 132 KES**; no live exchange-rate API is used. The shop is configured for Kenya (`KE` / `KES`).

## Deploy on Render

The database-backed app must run as a **Web Service**, not as a Static Site:

1. Create a Render PostgreSQL database and copy its internal connection string.
2. Create a Render Web Service from this GitHub repository.
3. Use a blank Root Directory, `npm install && npm run build` as the Build Command, and `npm start` as the Start Command.
4. Add `DATABASE_URL` using the PostgreSQL connection string and set `NODE_ENV` to `production`.
5. Deploy. The server creates the catalog tables and imports the 94 products when it starts.

Choose a database plan that meets your persistence needs; Render plan availability and retention can change. Once the new Web Service is working, use its URL as the live site.

The database stores catalog records only. Checkout continues to use the existing SleepOutside checkout service.
