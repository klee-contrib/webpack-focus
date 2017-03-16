import baseConfig from './base'

import path from 'path';
// import { configBuilder } from './index';

const defaultConfig = (environnement, definedVariables) => {
    const config = baseConfig(environnement, definedVariables);

    const API_PROTOCOL = environnement.API_PROTOCOL || 'http';
    const API_HOST = environnement.API_HOST || 'localhost';
    const API_PORT = environnement.API_PORT || 8080;
    const API_SUBDOMAIN = environnement.API_SUBDOMAIN || '';

    const BASE_URL = environnement.BASE_URL ? environnement.BASE_URL : '';

    // Check if focus libraries should be held locally or read from NPM
    const localFocus = environnement.LOCAL_FOCUS ? JSON.parse(environnement.LOCAL_FOCUS) : false;

    if (localFocus) {
        config.addAlias('focus-core', path.resolve(process.cwd(), '../focus-core'));
        config.addAlias('focus-components', path.resolve(process.cwd(), '../focus-components'));
    }

    config.addDefinedVariable('__API_ROOT__', JSON.stringify(environnement.API_ROOT ? environnement.API_ROOT : `${API_PROTOCOL}://${API_HOST}:${API_PORT}/${API_SUBDOMAIN}`));
    config.addDefinedVariable('__BASE_URL__', JSON.stringify(BASE_URL));

    return config;
}

export default defaultConfig;