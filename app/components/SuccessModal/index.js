import React from "react";
import { View, Image, StyleSheet, Modal, Text } from 'react-native';
import AppStyles from "../../AppStyles";
import TouchableButton from '../TouchableButton';
import config from '../../config';
import AppJson from '../../../app.json';

export default class SuccessModal extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        let label = config.channel === 'development' ? 'Dev ' : ''
        return (
            <Modal
                visible={this.props.active}>
                <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                    <Image source={require('../../../assets/img/reload.png')} style={styles.imageStyle} />
                    <View style={{ justifyContent: "center", alignSelf: "center", alignItems: "center" }}>
                        <Text style={{ fontFamily: AppStyles.fonts.semiBoldFont, fontSize: 20 }}>SUCCESSFULLY</Text>
                        <Text style={{ fontFamily: AppStyles.fonts.semiBoldFont, fontSize: 20, color: AppStyles.colors.primaryColor }}>UPDATED!!</Text>
                        <Text style={{ fontFamily: AppStyles.fonts.semiBoldFont, fontSize: 16 }}>{label}v{AppJson.expo.version}</Text>
                    </View>
                    <View style={[AppStyles.mainInputWrap]}>
                        <TouchableButton
                            containerStyle={[AppStyles.formBtn, { marginHorizontal: 10 }]}
                            label={'OK'}
                            onPress={() => { this.props.reloadApp() }}
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
