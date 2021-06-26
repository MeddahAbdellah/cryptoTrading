import dotenv from 'dotenv';
import convict from 'convict';
import LoggerService from 'services/logger.service';

dotenv.config();

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['prod', 'dev', 'test'],
    default: 'dev',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    env: 'PORT',
    default: 7550,
    arg: 'port'
  },
});



const env = config.get('env');
try {
  config.loadFile(`./config/${env}.json`);
} catch (error) {
  LoggerService.warn(error);
}

config.validate({ allowed: 'strict' }); // throws error if config does not conform to schema

export default config.getProperties(); // so we can operate with a plain old JavaScript object and abstract away convict (optional)
