import React, { useState } from 'react'
import { StyleSheet, Text, View, Platform, TouchableOpacity, FlatList, ScrollView, Modal, SafeAreaView, Image } from 'react-native'
import AppStyles from '../../AppStyles'
import { Textarea } from 'native-base';
import fuzzy from 'fuzzy'
import StaticData from '../../StaticData';
import TouchableButton from '../TouchableButton';
import times from '../../../assets/img/times.png'


const CommentChip = ({ comment, setSelectedComment }) => {
    return (
        <TouchableOpacity style={[styles.itemContainer, { borderColor: comment.colorCode }]} onPress={() => setSelectedComment(comment)}>
            <Text style={styles.itemName}>{comment.name}</Text>
        </TouchableOpacity>
    )
}
const StatusFeedbackModal = ({ visible, 
    showFeedbackModal, 
    commentsList, 
    showAction = true, 
    showFollowup = true, 
    modalMode,
    performAction,
    performFollowup,
    performReject,
}) => {
    const [selectedComment, setSelectedComment] = useState(null);
    let data = [];
    if (selectedComment != null && data && data.length === 0) {
        data = fuzzy.filter(selectedComment, commentsList, { extract: (e) => (e.name) })
        data = data.map((item) => item.original)
    }
    else {
        data = StaticData.commentsFeedback;
    }
    return (
        <Modal visible={visible}>
            <SafeAreaView style={AppStyles.mb1}>
                <View style={styles.modalMain}>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => showFeedbackModal(false)}
                    >
                        <Image source={times} style={styles.closeImg} />
                    </TouchableOpacity>
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
                            onChangeText={(text) => setSelectedComment(text)}
                            value={selectedComment}
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
                                <CommentChip comment={item} setSelectedComment={(comment) => setSelectedComment(comment.name)} />
                            )}
                            keyExtractor={(item, index) => item.value}
                        />
                    </ScrollView>

                    <View style={styles.buttonsContainer}>
                        {
                            showAction && <TouchableButton
                                containerStyle={styles.button}
                                fontFamily={AppStyles.fonts.boldFont}
                                fontSize={16}
                                onPress={() => selectedComment ? performAction(modalMode, selectedComment) : alert('Please select a comment to continue')}
                                label={ modalMode === 'call' ? 'Meeting Setup' : 'Deal Signed'}
                            />
                        }
                        {
                            showFollowup && <TouchableButton
                                containerStyle={styles.button}
                                containerBackgroundColor={AppStyles.colors.yellowBg}
                                fontFamily={AppStyles.fonts.boldFont}
                                fontSize={16}
                                textColor={AppStyles.colors.textColor}
                                onPress={() => selectedComment ? performFollowup(selectedComment) :  alert('Please select a comment to continue')}
                                label={'Follow up'}
                            />
                        }
                        <TouchableButton
                            containerStyle={[styles.button, {width: showAction ? '32%' : '100%'}]}
                            fontFamily={AppStyles.fonts.boldFont}
                            fontSize={16}
                            containerBackgroundColor={AppStyles.colors.redBg}
                            onPress={() => selectedComment ? performReject(selectedComment) :  alert('Please select a comment to continue')}
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
        color: AppStyles.colors.textColor,
    },
    itemContainer: {
        borderWidth: 1,
        overflow: 'hidden',
        borderRadius: 12,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 8,
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
        minHeight: 55,
        borderRadius: 4,
        padding: 10,
        width: '32%'
    },
    closeBtn: {
        alignSelf: 'flex-end',
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 50,
    },
    closeImg: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
    },
})
