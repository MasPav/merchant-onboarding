const { existsSync, mkdirSync, writeFile } = require('fs');
const { argv } = require('yargs');
require('dotenv').config();

const getTargetPathFromEnv = (env: string) => {
    const targets: any = {
        local: `./src/environments/environment.ts`,
        uat: `./src/environments/environment.uat.ts`,
        prod: `./src/environments/environment.prod.ts`,
    }
    return targets[env];
}

const environment = argv.environment;
const targetPath = getTargetPathFromEnv(environment);
const envDirectory = `./src/environments`;

if (!existsSync(envDirectory)) {
    mkdirSync(envDirectory);
    console.log('Created environments folder');
}

const environmentFileContent = `
export const environment = {
   production: ${environment === 'prod'},
   environment: "${environment}",
   APP_NAME: "${process.env["APP_NAME"]}",
   LOCAL_STORAGE_KEY: "${process.env['LOCAL_STORAGE_KEY']}",
   MERCHANT_ID: "${process.env['MERCHANT_ID']}",
   TRANSFLOW_ID: "${process.env['TRANSFLOW_ID']}",
   MERCHANT_PRODUCT_ID: "${process.env['MERCHANT_PRODUCT_ID']}",
   MERCHANT_CATALOGUE_API_URL: "${process.env['MERCHANT_CATALOGUE_API_URL']}",
   MERCHANT_CATALOGUE_API_KEY: "${process.env['MERCHANT_CATALOGUE_API_KEY']}",
   MERCHANT_ONBOARDING_API_URL: "${process.env['MERCHANT_ONBOARDING_API_URL']}",
   MERCHANT_ONBOARDING_API_KEY: "${process.env['MERCHANT_ONBOARDING_API_KEY']}",
   MERCHANT_ONBOARDING_S3_URL: "${process.env['MERCHANT_ONBOARDING_S3_URL']}",
   INTERNAL_MERCHANT_ONBOARDING_API_KEY: "${process.env['INTERNAL_MERCHANT_ONBOARDING_API_KEY']}",
   INTERNAL_TRANSFLOW_ID: "${process.env['INTERNAL_TRANSFLOW_ID']}",
   AWS_ACCESS_KEY: "${process.env['ACCESS_KEY']}",
   AWS_SECRET: "${process.env['ACCESS_SECRET']}",
   AWS_REGION: "${process.env['REGION']}",
};
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err: any) {
    if (err) {
        throw console.error(err);
    }
    console.log(`Wrote env variables to ${targetPath}`);
});
