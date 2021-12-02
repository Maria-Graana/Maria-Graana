/** @format */

import React from 'react'
import { View, Text } from 'react-native'
import { Button } from 'native-base'
import AppStyles from '../../AppStyles'
import AttachmentTile from '../../components/AttachmentTile'

const AddAttachment = (props) => {
  const { showDeleteDialog, signedServiceFile, downloadFile, workflow, attachementData, purpose } =
    props
  return (
    <View style={[AppStyles.mainInputWrap, { marginTop: 0 }]}>
      {props.signedServiceFile && workflow === 'rcm' && (
        <AttachmentTile
          docType={'Signed Services Agreement'}
          data={signedServiceFile}
          viewAttachments={downloadFile}
          deleteAttachment={showDeleteDialog}
          signedServiceFile={signedServiceFile}
        />
      )}
      {/* {!props.signedServiceFile && workflow === 'rcm' && (
        <Button
          style={[AppStyles.formBtn, { marginTop: 10, marginHorizontal: 15 }]}
          onPress={() => {
            props.onPress('signed_services_agreement')
          }}
        >
          <Text style={AppStyles.btnText}>ADD SIGNED SERVICES AGREEMENT</Text>
        </Button>
      )} */}
      {!attachementData[0] && purpose != 'view' && (
        <Button
          style={[AppStyles.formBtn, { marginTop: 10, marginHorizontal: 15 }]}
          onPress={() => {
            props.onPress('attachment')
          }}
        >
          <Text style={AppStyles.btnText}>ADD ATTACHMENT</Text>
        </Button>
      )}
    </View>
  )
}

export default AddAttachment
