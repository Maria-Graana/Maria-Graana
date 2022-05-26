/** @format */

import * as Updates from 'expo-updates'

const config = {
  development: {
    // apiPath: 'https://stage.arms.graana.rocks',
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

if (Updates.releaseChannel === 'default') {
  module.exports = config['development']
} else if (Updates.releaseChannel.indexOf('production') !== -1) {
  module.exports = config['production']
} else if (Updates.releaseChannel.indexOf('staging') !== -1) {
  module.exports = config['staging']
} else if (Updates.releaseChannel.indexOf('development') !== -1) {
  module.exports = config['development']
} else {
  module.exports = config['development']
}
