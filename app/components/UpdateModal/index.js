import React from "react";
import { View, Image, StyleSheet, Modal, Text } from 'react-native';
import AppStyles from "../../AppStyles";
import TouchableButton from '../TouchableButton';

export default class UpdateModal extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Modal
                visible={this.props.active}>
                <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                    <Image source={require('../../../assets/img/update.png')} style={styles.imageStyle} />
                    <View style={{ justifyContent: "center", alignSelf: "center", alignItems: "center" }}>
                        <Text style={{ fontFamily: AppStyles.fonts.semiBoldFont, fontSize: 16 }}>Newer Version of App is Available</Text>
                        <Text style={{ fontFamily: AppStyles.fonts.semiBoldFont, fontSize: 16 }}>Please Click Below to Update.</Text>
                    </View>
                    <View style={[AppStyles.mainInputWrap]}>
                        <TouchableButton
                            containerStyle={[AppStyles.formBtn, { marginHorizontal: 10 }]}
                            label={'UPDATE'}
                            onPress={() => { this.props.click() }}
                            loading={this.props.loading}
                        />
                    </View>

                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        resizeMode: "center",
        flex: 0.5,
        width: '90%',
        alignSelf: 'center'
    },
});
