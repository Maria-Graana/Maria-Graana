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
import { AntDesign, Ionicons, Octicons } from '@expo/vector-icons'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

const ViewCheckListModal = ({
  viewCheckList,
  toggleViewCheckList,
  selectedViewingData,
  toggleExpandable,
}) => {
  //console.log(selectedViewingData ? (selectedViewingData) : 'none');
  return (
    <Modal
      visible={viewCheckList}
      animationType="slide"
      onRequestClose={() => toggleViewCheckList(false)}
    >
      <SafeAreaView style={[AppStyles.mb1]}>
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
                toggleViewCheckList(false)
              }}
              name="close"
              size={26}
              color={AppStyles.colors.textColor}
            />
            <Text style={styles.textHeading}>Viewing Feedback</Text>
          </View>
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={selectedViewingData}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  style={styles.header}
                  onPress={() => toggleExpandable(!item.isExpanded, item.id)}
                >
                  <Octicons style={styles.headerIcon} name="tasklist" size={26} color="white" />
                  <Text style={styles.headerItemTitle}>{item.title}</Text>
                  {/* <Ionicons style={styles.iconStyle} name={item.isExpanded ? "ios-arrow-dropup" : "ios-arrow-dropdown"} size={26} color={AppStyles.colors.primaryColor} /> */}
                </TouchableOpacity>
                {item.isExpanded ? (
                  <View>
                    {item.checkList.map((item) => (
                      <View key={item} style={styles.itemRow}>
                        <Ionicons
                          name="ios-checkmark-circle-outline"
                          size={26}
                          color={AppStyles.colors.primaryColor}
                        />
                        <Text style={styles.itemText}>{item}</Text>
                      </View>
                    ))}
                    <Text style={styles.customerFeedBackHeading}>Viewing Feedback:</Text>
                    <Text style={styles.customerFeedBack}>{item.customer_feedback}</Text>
                  </View>
                ) : null}
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default ViewCheckListModal

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#e7ecf0',
  },
  closeStyle: {
    position: 'absolute',
    right: 15,
  },
  textHeading: {
    color: AppStyles.colors.textColor,
    fontSize: AppStyles.fontSize.large,
    fontFamily: AppStyles.fonts.semiBoldFont,
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'transparent',
  },
  headerIcon: {
    backgroundColor: AppStyles.colors.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 10,
    margin: 2,
  },
  headerItemTitle: {
    fontSize: AppStyles.fontSize.large,
    marginHorizontal: 10,
  },
  iconStyle: {
    position: 'absolute',
    right: 15,
  },
  itemRow: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#ddd',
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    marginHorizontal: 15,
    paddingHorizontal: 10,
  },
  itemText: {
    fontSize: AppStyles.fontSize.medium,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.textColor,
    marginHorizontal: 15,
  },
  customerFeedBack: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginHorizontal: 15,
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderRadius: 4,
    fontSize: 16,
    fontFamily: AppStyles.fonts.defaultFont,
  },
  customerFeedBackHeading: {
    backgroundColor: AppStyles.colors.background,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    borderWidth: 0.5,
    borderColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 4,
    fontSize: 18,
    fontFamily: AppStyles.fonts.semiBoldFont,
  },
})
