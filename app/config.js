/** @format */
import * as Updates from 'expo-updates'

const ENV = {
  development: {
    apiPath: 'https://dev.arms.graana.rocks',
    graanaUrl: 'https://dev.graana.rocks',
    channel: 'development',
  },
  staging: {
    apiPath: 'https://stage.arms.graana.rocks',
    graanaUrl: 'https://ssr.staging.graana.rocks',
    channel: 'staging',
  },
  production: {
    apiPath: 'https://apiarmsm.graana.com',
    graanaUrl: 'https://www.graana.com',
    channel: 'production',
  },
}

function getEnvVars(env = '') {
  if (env && env.indexOf('staging') !== -1) return ENV.staging
  else if (env && env.indexOf('production') !== -1) return ENV.production
  else return ENV.development
}

const config = getEnvVars(Updates.releaseChannel)
export default config

export function getEndPoint(endPoint) {
  return config.apiPath
}
