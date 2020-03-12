import { Toast } from 'native-base';

const helper = {
    successToast (message) {
        Toast.show({
          text: message,
          duration: 3000,
          type: 'success'
        })
    },
    errorToast (message) {
        Toast.show({
          text: message,
          duration: 3000,
          type: 'danger'
        })
    },
    warningToast (message) {
      Toast.show({
        text: message,
        duration: 3000,
        type: 'warning'
      })
  }
}

module.exports = helper;