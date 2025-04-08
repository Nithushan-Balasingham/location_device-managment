
# Location Management


## Technologies Used
- **Node.js** with **Nests.js**
- **Next.js**
- **JWT Authentication** for security
- **PostgreSQL** (or any supported database)

## Installation Instructions

Follow these steps to set up the project:

```sh
# 1. Clone the repository 
git https://github.com/Nithushan-Balasingham/location_device-managment
cd BE

# 2. Install dependencies
npm i

# 3. Generate the Prisma client (needed to interact with the database)
npx prisma generate

# 4. Apply database migrations (creates or updates the database schema)
npx prisma migrate dev

# 5. Start the development server
npm run dev
```

## Environment Variables
Ensure you have a `.env` file with the required variables:

```ini
AUTH_SECRET="2XVmcZXvFLr71+CThzEymk098yL9L51ZRWldX3MAcqA="
NEXT_PUBLIC_API_URL="http://localhost:8080"





