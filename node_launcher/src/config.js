export const Config = {
    PORT: process.env.PORT || 8080,
    DO_OVERRIDE_METADATA_ENDPOINT: process.env.DO_OVERRIDE_METADATA_ENDPOINT || 'true',
    METADATA_ENDPOINT_OVERRIDE: process.env.METADATA_ENDPOINT_OVERRIDE || 'server',
    TEMPLATE_DIR: './src/static/templates',
    RUNNNG_IN_DOCKER: process.env.RUNNNG_IN_DOCKER || false,
    PREPARING_DOCKER: process.env.PREPARING_DOCKER || false,
    WHOAMI: process.env.WHOAMI || 'NoSK',
    STARTER_KIT_URI: process.env.STARTER_KIT_URI || 'NoURI',
    DOWNLOAD_DIR: process.env.DOWNLOAD_DIR || './src/static/downloads',
}

export function shouldOverrideMetadataEndpoint() {
    return Config.DO_OVERRIDE_METADATA_ENDPOINT === 'true' || Config.DO_OVERRIDE_METADATA_ENDPOINT === true;
}
