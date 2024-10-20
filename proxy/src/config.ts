import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

type Config = {
  serviceRoute:string

};

// Function to load and validate environment variables
function loadConfig(): Config {
  // Determine the environment and set the appropriate .env file
  const envPath = path.resolve(__dirname, './configs/.env');
  dotenv.config({ path: envPath });

  // Define a schema for the environment variables
  const envVarsSchema = Joi.object({
    SERVICE_ROUTE:Joi.string()
  }).unknown().required();

  // Validate the environment variables
  const { value: envVars, error } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
   serviceRoute:envVars.SERVICE_ROUTE
  };
}

// Export the loaded configuration
const configs = loadConfig();
export default configs;