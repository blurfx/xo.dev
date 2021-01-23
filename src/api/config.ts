import { BlogConfig } from '@interfaces';
import config from '../../config.json';

const getConfig = (): BlogConfig => config;

export {
  getConfig,
};
