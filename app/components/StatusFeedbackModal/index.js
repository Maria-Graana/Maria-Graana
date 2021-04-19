import React from 'react'
import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native'
import AppStyles from '../../AppStyles'
import { Textarea } from 'native-base';
import Modal from 'react-native-modal'
import { FlatGrid } from 'react-native-super-grid';
import StaticData from '../../StaticData';
import TouchableButton from '../TouchableButton';


const CommentChip = ({ comment }) => {
    return (
        <TouchableOpacity style={[styles.itemContainer]} onPress={() => console.log(comment.value)}>
            <Text style={styles.itemName}>{comment.name}</Text>
        </TouchableOpacity>
    )
}

const StatusFeedbackModal = ({ visible, handleCommentsChange, comment }) => {
    let data = StaticData.callStatus;

    return (
        <Modal isVisible={visible}>
            <View style={styles.modalMain}>
                <View style={[AppStyles.mainInputWrap]}>
                    <Textarea
                        placeholderTextColor={'#a8a8aa'}
                        style={[
                            AppStyles.formControl,
                            Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
                            AppStyles.formFontSettings,
                            { height: 100, paddingTop: 10 },
                        ]}
                        rowSpan={5}
                        placeholder="Comments"
                        onChangeText={(text) => handleCommentsChange(text)}
                        value={comment}
                    />
                </View>
                <FlatGrid
                    style={{ maxHeight: 100, marginVertical: 10 }}
                    itemDimension={24}
                    data={data}
                    spacing={7}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                       <CommentChip comment={item}/>
                    )}
                />
                <View style={styles.buttonsContainer}>
                    <TouchableButton
                        containerStyle={AppStyles.formBtn}
                        onPress={() => console.log('action')}
                        label={'Action'}
                    />
                    <TouchableButton
                        containerStyle={AppStyles.formBtn}
                        containerBackgroundColor={AppStyles.colors.yellowBg}
                        onPress={() => console.log('follow up')}
                        label={'Follow up'}
                    />
                    <TouchableButton
                        containerStyle={AppStyles.formBtn}
                        containerBackgroundColor={AppStyles.colors.redBg}
                        onPress={() => console.log('reject')}
                        label={'Reject'}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default StatusFeedbackModal

const styles = StyleSheet.create({
    modalMain: {
        backgroundColor: '#e7ecf0',
        borderRadius: 7,
        overflow: 'hidden',
        zIndex: 5,
        position: 'relative',
        elevation: 5,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#333333',
        shadowOpacity: 1,
        padding: 15,
    },
    itemContainer: {
        borderWidth: 1,
        borderColor: '#2A7EF0',
        overflow: 'hidden',
        borderRadius: 12,
        color: '#2A7EF0',
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 10,
        paddingRight: 10,
    },
    itemName: {
        fontSize: 12,
        color: AppStyles.colors.textColor,
        fontFamily: AppStyles.fonts.semiBoldFont,
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'space-between',
    }
})
