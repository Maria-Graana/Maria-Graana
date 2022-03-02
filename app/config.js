/** @format */

import Constants from 'expo-constants'

const config = {
  development: {
    apiPath: 'https://stage.arms.graana.rocks',
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

if (Constants.manifest.releaseChannel === undefined) {
  module.exports = config['development']
} else if (Constants.manifest.releaseChannel.indexOf('production') !== -1) {
  module.exports = config['production']
} else if (Constants.manifest.releaseChannel.indexOf('staging') !== -1) {
  module.exports = config['staging']
} else if (Constants.manifest.releaseChannel.indexOf('cta-staging') !== -1) {
  module.exports = config['staging']
} else if (Constants.manifest.releaseChannel.indexOf('cta-dev') !== -1) {
  module.exports = config['development']
} else if (Constants.manifest.releaseChannel.indexOf('development') !== -1) {
  module.exports = config['development']
} else {
  module.exports = config['development']
}
