import React from 'react'
import { StyleSheet, Text, View, Platform, TouchableOpacity, FlatList, ScrollView, Modal, SafeAreaView } from 'react-native'
import AppStyles from '../../AppStyles'
import { Textarea } from 'native-base';
//import Modal from 'react-native-modal'
import StaticData from '../../StaticData';
import TouchableButton from '../TouchableButton';
import { useState } from 'react';


const CommentChip = ({ comment, setSelectedComment }) => {
    return (
        <TouchableOpacity style={[styles.itemContainer, {borderColor: comment.colorCode}]} onPress={() => setSelectedComment(comment)}>
            <Text style={styles.itemName}>{comment.name}</Text>
        </TouchableOpacity>
    )
}

const StatusFeedbackModal = ({ visible, handleCommentsChange, comment }) => {
    let data = StaticData.commentsFeedback;
    const [selectedComment, setSelectedComment] = useState(null);

    return (
        <Modal visible={visible}>
            <SafeAreaView style={AppStyles.mb1}>
                <View style={styles.modalMain}>
                    <View style={[AppStyles.mainInputWrap]}>
                        <Textarea
                            placeholderTextColor={'#a8a8aa'}
                            style={[
                                AppStyles.formControl,
                                Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
                                AppStyles.formFontSettings,
                                styles.commentContainer,
                            ]}
                            rowSpan={5}
                            placeholder="Comments"
                            onChangeText={(text) => handleCommentsChange(text)}
                            value={selectedComment ? selectedComment.name : ''}
                        />
                    </View>
                    <ScrollView scrollEnabled={true} horizontal showsHorizontalScrollIndicator={false}>
                        <FlatList
                            scrollEnabled={false}
                            style={{ minHeight: 100, marginVertical: 10 }}
                            data={data}
                            numColumns={5}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <CommentChip comment={item} setSelectedComment={setSelectedComment} />
                            )}
                            keyExtractor={(item,index)=> item.value}
                        />
                    </ScrollView>

                    <View style={styles.buttonsContainer}>
                        <TouchableButton
                            containerStyle={styles.button}
                            fontFamily={AppStyles.fonts.boldFont}
                            fontSize={16}
                            onPress={() => console.log('action')}
                            label={'Action'}
                        />
                        <TouchableButton
                             containerStyle={styles.button}
                            containerBackgroundColor={AppStyles.colors.yellowBg}
                            fontFamily={AppStyles.fonts.boldFont}
                            fontSize={16}
                            textColor={AppStyles.colors.textColor}
                            onPress={() => console.log('follow up')}
                            label={'Follow up'}
                        />
                        <TouchableButton
                            containerStyle={styles.button}
                            fontFamily={AppStyles.fonts.boldFont}
                            fontSize={16}
                            containerBackgroundColor={AppStyles.colors.redBg}
                            onPress={() => console.log('reject')}
                            label={'Reject'}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

export default StatusFeedbackModal

const styles = StyleSheet.create({
    modalMain: {
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        alignSelf: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    commentContainer: {
        height: 100,
        paddingTop: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: AppStyles.colors.textColor,
        color:  AppStyles.colors.textColor,
    },
    itemContainer: {
        borderWidth: 1,
        overflow: 'hidden',
        borderRadius: 12,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 5,
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
    },
    button: {
        justifyContent: 'center',
        minHeight: 40,
        borderRadius: 4,
        padding: 10,
        width: '30%'
    }
})
