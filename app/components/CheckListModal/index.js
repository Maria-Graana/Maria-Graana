/** @format */

import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  Animated,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'
import AppStyles from '../../AppStyles'
import { Textarea } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import TouchableButton from '../TouchableButton'
import MyCheckBox from '../MyCheckBox'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

const CheckListModal = ({
  data,
  selectedCheckList,
  isVisible,
  togglePopup,
  setSelected,
  userFeedback,
  setUserFeedback,
  viewingDone,
  loading,
}) => {
  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={() => togglePopup(false)}>
      <SafeAreaView style={[AppStyles.mb1]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.mainContainer]}>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 10,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AntDesign
                style={styles.closeStyle}
                onPress={() => {
                  togglePopup(false)
                }}
                name="close"
                size={26}
                color={AppStyles.colors.textColor}
              />
            </View>
            <AnimatedFlatList
              data={data}
              nestedScrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setSelected(item)}>
                  <View style={styles.itemRow}>
                    <MyCheckBox
                      onPress={() => setSelected(item)}
                      status={selectedCheckList.includes(item) ? true : false}
                    />
                    <Text style={styles.labelStyle}>{item}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => String(index)}
              contentContainerStyle={{ paddingTop: 0 }}
              scrollIndicatorInsets={{ top: 0 }}
            />
            <View style={[AppStyles.mainInputWrap, { paddingHorizontal: 15 }]}>
              <Textarea
                placeholderTextColor="#bfbbbb"
                style={[
                  AppStyles.formControl,
                  Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
                  AppStyles.formFontSettings,
                  { height: 100, paddingTop: 10 },
                ]}
                rowSpan={5}
                placeholder="Viewing Feedback"
                onChangeText={(text) => setUserFeedback(text)}
                value={userFeedback}
              />

              <TouchableButton
                containerStyle={[AppStyles.formBtn, styles.button]}
                label={'OK'}
                onPress={() => viewingDone()}
                loading={loading}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  )
}

export default CheckListModal

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#e7ecf0',
  },
  checkBox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    marginRight: 10,
  },
  itemRow: {
    width: wp('100%'),
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#ddd',
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    alignSelf: 'stretch',
  },
  labelStyle: {
    color: AppStyles.colors.textColor,
    marginLeft: wp('3%'),
    fontSize: 18,
    width: wp('80%'),
  },
  textHeading: {
    color: AppStyles.colors.textColor,
    fontSize: AppStyles.fontSize.large,
    fontFamily: AppStyles.fonts.semiBoldFont,
  },
  closeStyle: {
    position: 'absolute',
    right: 15,
  },
  button: {
    marginTop: 10,
  },
})
