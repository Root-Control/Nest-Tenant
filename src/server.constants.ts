import { Config, IEnvironmentConfig } from './config/config';
import { EnvironmentService } from './environment.variables';

console.log('Configurating the server');

//  Env service declaration
const envService = new EnvironmentService('.env');

//  Environment variables
const env = envService.get('NODE_ENV') || 'development';

//  SERVER_CONFIG Assignation
export const SERVER_CONFIG: IEnvironmentConfig = Config[env];

//  Token for DB_Connection
export const DB_CONNECTION_TOKEN: string = 'DbConnectionToken';

//  Token for Server
export const SERVER_CONFIG_TOKEN: string = 'ServerConfigToken';

//  Token for twitter_Config
export const FACEBOOK_CONFIG_TOKEN: string = 'FacebookConfigToken';

//  Token for twitter_Config
export const TWITTER_CONFIG_TOKEN: string = 'TwitterConfigToken';

//  Token for Google_config
export const GOOGLE_CONFIG_TOKEN: string = 'GoogleConfigToken';

//  Database Models

/**
 *  Token for User  model
 */
export const USER_MODEL_TOKEN: string = 'User';
/**
 *  Token for Article model
 */
export const ARTICLE_MODEL_TOKEN: string = 'Article';


//  Message definitions
export const MESSAGES = {
  UNAUTHORIZED_EMAIL_OR_USERNAME_IN_USE: 'Email or username already exists',
  UNAUTHORIZED_INVALID_PASSWORD: 'Invalid password',
  UNAUTHORIZED_INVALID_EMAIL: 'The email does not exist',
  UNAUTHORIZED_UNRECOGNIZED_BEARER: 'Unrecognized bearer of the token'
};