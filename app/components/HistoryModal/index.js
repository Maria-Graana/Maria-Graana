import React from "react";
import { Text, View, StyleSheet, Modal, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles';
import HistoryTile from '../HistoryTile';
import backArrow from '../../../assets/img/backArrow.png'

class HistoryModal extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { openPopup, closePopup, data } = this.props
        return (
            <Modal visible={openPopup}
                animationType="slide"
                onRequestClose={this.props.closePopup}
            >
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
                    <FlatList
                        data={data}
                        renderItem={({ item }, index) => (
                            <HistoryTile
                                data={item}
                            />
                        )}
                        keyExtractor={(_, index) => index}
                    />
                </SafeAreaView>
            </Modal>
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
        alignItems: "center"
    },
    headerText: {
        paddingRight: 30,
        fontFamily: AppStyles.fonts.semiBoldFont,
        fontSize: 16
    },
});

mapStateToProps = (store) => {
    return {
        user: store.user.user,
        lead: store.lead.lead
    }
}

export default connect(mapStateToProps)(HistoryModal)
