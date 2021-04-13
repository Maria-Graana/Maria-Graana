/** @format */

import Constants from 'expo-constants'

const config = {
  development: {
    apiPath: 'https://api.stage.realtor.agency21.rocks',
    mapUrl: 'https://maps.graana.rocks/api/map/',
    graanaUrl: 'https://dev.graana.rocks',
    channel: 'development',
  },
  staging: {
    apiPath: 'https://api.stage.realtor.agency21.rocks',
    mapUrl: 'https://maps.graana.rocks/api/map/',
    graanaUrl: 'https://ssr.staging.graana.rocks',
    channel: 'staging',
  },
  production: {
    apiPath: 'https://apiarmsm.graana.com',
    mapUrl: 'https://www.graana.com/api/map/',
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
} else if (Constants.manifest.releaseChannel.indexOf('development') !== -1) {
  module.exports = config['development']
} else {
  module.exports = config['development']
}
