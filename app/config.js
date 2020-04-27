import Constants from 'expo-constants';

const config = {
  development: {
    apiPath: 'https://api.realtor.agency21.rocks',
  },
  production: {
    apiPath: 'https://apiarmsm.agency21.com.pk',
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
