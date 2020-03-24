import React from 'react'
import {
    View,
    Text,
} from 'react-native'
import { Button, } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import styles from './style'
import Modal from "react-native-modal";
import moment from 'moment';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles';
import Ability from '../../hoc/Ability';


class DairyPopup extends React.Component {
    constructor(props) {
        super(props)
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

    render() {
        const {
            data,
            openPopup,
            screenName,
            user
        } = this.props;
        return (
            <Modal isVisible={openPopup}>
                <View style={styles.container}>
                    <View style={styles.topBar}>
                        <AntDesign style={styles.closeStyle} onPress={this.closePopup} name="closecircle" size={24} color={AppStyles.colors.primaryColor} />
                        <Text style={[styles.timeWrap, { alignSelf: 'center' }]}>
                            {moment.utc(data.start).format('hh:mm a')} - {moment.utc(data.end).format("hh:mm a")}
                        </Text>

                        {
                            Ability.canEdit(user.role, screenName) && data.status === 'pending' || data.status === 'inProgress' ?
                                <View style={[styles.updateBtn]}>
                                    <AntDesign onPress={() => { this.updateDiary(data) }} name="edit" size={24} color={AppStyles.colors.primaryColor} />
                                </View>
                                :
                                null
                        }

                        {
                            Ability.canDelete(user.role, screenName) &&
                            <View style={[styles.updateBtn, { right: 50 }]}>
                                <AntDesign onPress={() => { this.deleteDiary(data) }} name="delete" size={24} color={AppStyles.colors.primaryColor} />
                            </View>
                        }



                    </View>
                    <View style={styles.viewWrap}>
                        <Text style={styles.taskTypeText}>
                            {data.taskType || ''}
                        </Text>
                    </View>
                    <View style={styles.subjectWrap}>
                        <Text style={styles.subjectText}>
                            {data.subject || ''}
                        </Text>
                    </View>
                    <View style={styles.viewWrap}>
                        <Text style={styles.notesText}>
                            {data.notes || ''}
                        </Text>
                    </View>
                    <View style={styles.btnWrap}>
                        {
                            Ability.canEdit(user.role, screenName) && data.status === 'pending' || data.status === 'inProgress' ?
                                <Button
                                    onPress={() => { this.inProgress(data, 'inProgress') }}
                                    style={data.status == 'inProgress' ? styles.disabledBtnStyle : [AppStyles.formBtn, { width: 120, minHeight: 45 }]}
                                    disabled={data.status == 'inProgress'}
                                >
                                    <Text style={data.status == 'inProgress' ? [AppStyles.btnText, styles.disabledBtnText,] : [AppStyles.btnText, { fontSize: 14 }]}>In Progress</Text>
                                </Button>
                                :
                                null
                        }


                        {
                            Ability.canEdit(user.role, screenName) && data.status !== 'completed' ?
                                <Button onPress={() => { this.markDone(data, 'completed') }}
                                    style={[AppStyles.formBtn, { width: 100, minHeight: 45 }]}>
                                    <Text style={[AppStyles.btnText, { fontSize: 14 }]}>Done</Text>
                                </Button>
                                :
                                null
                        }


                    </View>
                </View>
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