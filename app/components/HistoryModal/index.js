import React from "react";
import { Text, View, StyleSheet, Modal, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles';
import HistoryTile from '../HistoryTile';
import backArrow from '../../../assets/img/backArrow.png'
import LoadingNoResult from '../LoadingNoResult';
import MeetingTile from '../MeetingTile';
import helper from '../../helper';
import HistoryStatusModal from '../HistoryStatusModal';
import MeetingModal from '../MeetingModal';
import moment from 'moment';
import Loader from '../loader';
import axios from 'axios';

class HistoryModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formData: {
                time: '',
                date: '',
                addedBy: '',
                taskCategory: '',
                leadId: this.props.lead.id,
                start: '',
                end: '',
                subject: this.props.lead.customer ? `Meeting with ${this.props.lead.customer.customerName}` : null
            },
            diaryTask: {
                subject: '',
                taskType: 'follow up',
                start: '',
                end: '',
                date: '',
                notes: '',
                status: 'pending',
                leadId: this.props.lead.id,
            },
            active: false,
            doneStatusId: '',
            visibleStatus: false,
            checkValidation: false,
            modalLoading: false,
            loading: false,
            diaryForm: false,
            data: []
        }
    }

    componentDidMount() {
        this.getCallHistory()
    }

    openStatus = (data) => {
        this.setState({
            visibleStatus: !this.state.visibleStatus,
            doneStatusId: data,
        })
    }

    getCallHistory = () => {
        const { lead } = this.props
        axios.get(`/api/diary/all?armsLeadId=${lead.id}`)
            .then((res) => {
                this.setState({ data: res.data.rows, modalLoading: false })
            })
    }

    sendStatus = (status) => {
        const { lead } = this.props
        const { formData, doneStatusId } = this.state
        let body = {
            response: status,
            rcmLeadId: lead.id
        }
        axios.patch(`/api/diary/update?id=${doneStatusId.id}`, body)
            .then((res) => {
                this.getCallHistory()
                this.setState({
                    visibleStatus: !this.state.visibleStatus
                }, () => {
                    if (status === 'follow_up') {
                        setTimeout(() => {
                            this.addDiary()
                        }, 500)

                    }
                })
            })
    }

    handleFormDiary = (value, name) => {
        const { diaryTask } = this.state
        let newdiaryTask = { ...diaryTask }
        newdiaryTask[name] = value
        this.setState({ diaryTask: newdiaryTask })
    }

    formSubmitDiary = (id) => {
        const { diaryTask } = this.state
        if (!diaryTask.start || !diaryTask.date) {
            this.setState({ checkValidation: true })
        } else {
            this.setState({ loading: true })
            let formattedDate = helper.formatDate(diaryTask.date);
            const start = helper.formatDateAndTime(formattedDate, diaryTask.start);
            const end = moment(start).add(0.33, 'hours').format('YYYY-MM-DDTHH:mm:ssZ');
            let body = {
                subject: 'Follow up with client',
                date: start,
                end: end,
                armsLeadId: diaryTask.leadId,
                start: start,
                taskType: diaryTask.taskType,
                time: start,
            }
            axios.post(`/api/leads/project/meeting`, body)
                .then((res) => {
                    helper.successToast(`Follow up task added to the Diary`)
                    this.setState({
                        active: false,
                        modalLoading: true,
                        loading: false
                    })
                    this.getCallHistory()
                }).catch((error) => {
                    console.log(error)
                    helper.errorToast(`Some thing went wrong!!!`)
                }).finally(() => {
                    this.setState({ loading: false })
                })
        }
    }

    addDiary = () => {
        const { diaryTask } = this.state
        const startTime = moment()
        const endTime = moment()
        const add20Minutes = startTime.add(20, 'minutes');
        const newformData = { ...diaryTask }
        newformData['taskType'] = 'follow up'
        newformData['start'] = add20Minutes;
        newformData['end'] = endTime
        newformData['date'] = add20Minutes;
        this.setState({
            visibleStatus: false,
            active: !this.state.active,
            diaryForm: true,
            diaryTask: newformData,
        })
    }

    //  ************ Function for open modal ************ 
    openModal = () => {
        this.setState({
            active: !this.state.active,
            formData: {},
        })
    }

    render() {
        const { openPopup, closePopup, lead, user } = this.props
        const { doneStatusId, visibleStatus, formData, checkValidation, diaryForm, loading, diaryTask, active, modalLoading, data } = this.state
        let leadAssign = helper.checkAssignedSharedStatus(user, lead)
        return (
            !modalLoading ?
                <Modal
                    visible={openPopup}
                    animationType="slide"
                    onRequestClose={this.props.closePopup}>
                    <SafeAreaView style={[AppStyles.mb1, styles.container]}>
                        <View style={styles.topHeader}>
                            <TouchableOpacity
                                onPress={() => { this.props.closePopup() }}>
                                <Image source={backArrow} style={[styles.backImg]} />
                            </TouchableOpacity>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>CALL HISTORY</Text>
                            </View>
                        </View>
                        {
                            data.length ?
                                <FlatList
                                    style={styles.flatStyle}
                                    data={data}
                                    renderItem={({ item }, index) => (
                                        <HistoryTile
                                            data={item}
                                            openStatus={this.openStatus}
                                            sendStatus={this.sendStatus}
                                            doneStatus={visibleStatus}
                                            doneStatusId={doneStatusId}
                                            editFunction={this.editFunction}
                                            leadClosedCheck={leadAssign}
                                        />
                                    )}
                                    keyExtractor={(_, index) => index}
                                />
                                :
                                <LoadingNoResult loading={false} />
                        }
                        <HistoryStatusModal
                            visibleStatus={visibleStatus}
                            sendStatus={this.sendStatus}
                            openStatus={this.openStatus}
                        />
                        <MeetingModal
                            active={active}
                            formData={formData}
                            checkValidation={checkValidation}
                            openModal={this.openModal}
                            diaryForm={true}
                            diaryTask={diaryTask}
                            handleFormDiary={this.handleFormDiary}
                            formSubmitDiary={this.formSubmitDiary}
                            loading={loading}
                        />
                    </SafeAreaView>
                </Modal>
                :
                <Loader loading={loading} />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e7ecf0',
        paddingVertical: 10
    },
    topHeader: {
        flexDirection: 'row',
        margin: 10,
    },
    backImg: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    headerText: {
        paddingRight: 30,
        fontFamily: AppStyles.fonts.boldFont,
        fontSize: 16
    },
    flatStyle: {
        padding: 10
    }
});

mapStateToProps = (store) => {
    return {
        user: store.user.user,
        lead: store.lead.lead
    }
}

export default connect(mapStateToProps)(HistoryModal)
