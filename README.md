### Quick Start
* Install node.js: https://nodejs.org​ `(compatible version 22.11.0 or higher)`
* Enable Corepack (required for Yarn 4.x):
  ```bash
  corepack enable
  ```
* Install node modules by running terminal command `yarn install`

### For Production Run
* Run the app `yarn start` (DO NOT USE NPM)

### For Development Run
* Copy env `.env.dev` into `.env` file
* Run the app `yarn start`

### For development build
* Run `yarn build`

### Deploying with Vercel CLI
1. Install Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. Deploy to Vercel:
   * For production deployment:
     ```bash
     vercel --prod
     ```
   * For preview deployment:
     ```bash
     vercel
     ```

### Note
1. For pipeline we will need KEY_FILE and the same can be obtained as explained here Create service account for Firebase - https://cloud.google.com/iam/docs/creating-managing-service-account-keys
1. If you see any error on CI deployment then create env as "CI=false". This will allows deploying code even though there are build warnings

