import React from 'react'
import {
    View,
    Text,
    Modal,
    SafeAreaView,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import { Button, } from 'native-base';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './style'
import moment from 'moment';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles';
import Ability from '../../hoc/Ability';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'



class DairyPopup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            todayDate: moment(new Date()).format('L'),
        }
    }

    onChange = (value) => {
    }

    updateDiary = (data) => {
        this.props.updateDiary(data)
    }

    deleteDiary = (data) => {
        this.props.deleteDiary(data);
        this.closePopup();
    }

    closePopup = () => {
        this.props.closePopup()
    }

    markDone = (val, type) => {
        this.props.popupAction(val, type);
        this.closePopup();
    }

    inProgress = (val, type) => {
        this.props.popupAction(val, type);
        this.closePopup();
    }

    setStatusText = (val) => {
        let taskDate = moment(val.date).format('L')
        if (taskDate > this.state.todayDate) {
            return 'To-do'
        }
        if (taskDate != this.state.todayDate && val.status !== 'completed') {
            return 'Overdue';
        }
        else if (val.status === 'inProgress') {
            return 'In Progress';
        }
        else if (val.status === 'completed') {
            return 'Completed';
        }
        else if (val.status === 'pending') {
            return 'To-do';
        }
    }

    render() {
        const {
            data,
            openPopup,
            screenName,
            user,
            onLeadLinkClicked
        } = this.props;
        return (
            <Modal visible={openPopup}
                animationType="slide"
                onRequestClose={this.closePopup}
            >
                <SafeAreaView style={[AppStyles.mb1, { justifyContent: 'center', backgroundColor: '#e7ecf0' }]}>
                    <AntDesign style={styles.closeStyle} onPress={this.closePopup} name="close" size={26} color={AppStyles.colors.textColor} />
                    <View style={[styles.viewContainer]}>
                        <View style={styles.horizontalWrapStyle}>
                            <Text style={styles.textStyle}>{data.subject} </Text>
                            {
                                data.taskType !== 'dayTask' && data.taskType !== 'weekly' &&
                                    Ability.canEdit(user.role, screenName) && data.status === 'pending' || data.status === 'inProgress' ?
                                    < MaterialCommunityIcons onPress={() => this.updateDiary(data)} name="square-edit-outline" size={26} color={AppStyles.colors.primaryColor} />
                                    : null
                            }


                        </View>
                        <Text style={[styles.textStyle, { paddingHorizontal: 15 }]}>{data.taskType !== undefined && data.taskType.charAt(0).toUpperCase() + data.taskType.slice(1)}</Text>

                        <View style={styles.horizontalWrapStyle}>
                            <Text style={styles.textStyle}>{moment.utc(data.start).format('hh:mm a')} - {moment.utc(data.end).format("hh:mm a")} </Text>
                            {
                                data.armsLeadId !== null ?
                                    <TouchableOpacity style={styles.lead} onPress={() => onLeadLinkClicked(data.armsLeadId)} >
                                        <Text style={styles.leadText} >
                                            Lead Link
                                 </Text>
                                    </TouchableOpacity>
                                    :
                                    null
                            }
                            <Text style={[styles.statusText, { color: data.statusColor, borderColor: data.statusColor }]}>{this.setStatusText(data)}</Text>

                        </View>

                        <View style={styles.underLine}
                        />

                        {
                            data.notes ?
                                <ScrollView style={{ minHeight: 20, maxHeight: 200 }} >
                                    <Text style={[styles.textStyle, { fontSize: AppStyles.fontSize.medium, paddingHorizontal: 15 }]}>
                                        {data.notes}
                                    </Text>
                                </ScrollView>
                                : null
                        }

                        <View style={styles.btnWrap}>
                            {
                                Ability.canEdit(user.role, screenName) && data.status === 'pending' || data.status === 'inProgress' ?
                                    <Button bordered
                                        onPress={() => { this.inProgress(data, 'inProgress') }}
                                        style={data.status == 'inProgress' ? styles.disabledBtnStyle : [AppStyles.formBtn,{width:150}]}
                                        disabled={data.status == 'inProgress'}
                                    >
                                        <Text style={data.status == 'inProgress' ? [AppStyles.btnText, styles.disabledBtnText,] : [AppStyles.btnText,{ fontFamily:AppStyles.fonts.semiBoldFont}]}>In Progress</Text>
                                    </Button>
                                    :
                                    null
                            }


                            {
                                Ability.canEdit(user.role, screenName) && data.status !== 'completed' ?
                                    <Button onPress={() => { this.markDone(data, 'completed') }}
                                        style={[AppStyles.formBtn,{width:150}]}>
                                    <Text style={[AppStyles.btnText, {fontFamily:AppStyles.fonts.semiBoldFont}]}>Done</Text>
                                    </Button>
                                    :
                                    null
                            }

                        </View>



                    </View>
                </SafeAreaView>
            </Modal>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(DairyPopup)