
# Location Management


## Technologies Used
- **Node.js** with **Nests.js**
- **Next.js**
- **JWT Authentication** for security
- **PostgreSQL** 

## Installation Instructions for BE

Follow these steps to set up the project:

```sh
# 1. Clone the repository 
git https://github.com/Nithushan-Balasingham/location_device-managment
cd BE

# 2. Install dependencies
npm i

# 5. Start the development server
npm run start:dev
```

## Environment Variables
Ensure you have a `.env` file with the required variables:

```ini
DATABASE_URL="DATABASE_URL"
AT_SECRET="ADD SECRET FOR ACCESS Token"
RT_SECRET="ADD SECRET FOR Refresh Token"
DB_HOST= "DATABASE_HOST"
DB_PORT="DATABASE_RUNNING_PORT"
DB_USERNAME= "DATABASE_USERNAME"
DB_PASSWORD= "DATABASE_PASSWORD"
DB_DATABASE= "DATABASE_NAME"



```
## Installation Instructions for FE

Follow these steps to set up the project:

```sh
# 1. Clone the repository 
git https://github.com/Nithushan-Balasingham/location_device-managment
cd FE

# 2. Install dependencies
npm i

# 5. Start the development server
npm run dev
```

## Environment Variables
Ensure you have a `.env` file with the required variables:

```ini
AUTH_SECRET="2XVmcZXvFLr71+CThzEymk098yL9L51ZRWldX3MAcqA="
NEXT_PUBLIC_API_URL="http://localhost:8080"





