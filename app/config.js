import Constants from 'expo-constants';

const config = {
  development: {
    // apiPath: 'https://api.realtor.agency21.rocks',
    apiPath: 'http://192.168.18.172:3030',
    channel: 'development'
  },
  production: {
    apiPath: 'https://apiarmsm.agency21.com.pk',
    channel: 'production'
  },
};

if (Constants.manifest.releaseChannel === undefined) {
  module.exports = config['development'];
}
else if (Constants.manifest.releaseChannel.indexOf('production') !== -1) {
  module.exports = config['production'];
}
else if (Constants.manifest.releaseChannel.indexOf('development') !== -1) {
  module.exports = config['development'];
}
else {
  module.exports = config['development'];
}
