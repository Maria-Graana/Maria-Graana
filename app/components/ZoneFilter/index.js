import React from 'react'
import {
    View,
    Modal,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native'
import backArrow from '../../../assets/img/backArrow.png'
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles';
import PickerComponent from '../Picker/index';
import styles from './style';
import { Button } from 'native-base';
import ErrorMessage from '../ErrorMessage/index';

class ZoneFilter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { zones, fetchZones, regions, openPopup, closeFilters, formData, handleZoneForm, submitZoneFilter, organizations, checkValidation } = this.props;
        return (
            <Modal visible={openPopup}
                animationType="slide"
                onRequestClose={closeFilters}
            >
                <SafeAreaView style={[AppStyles.mb1, { backgroundColor: '#e7ecf0' }]}>
                    <ScrollView>
                        <View style={styles.headerView}>
                            <TouchableOpacity
                                onPress={() => { closeFilters() }}>
                                <Image source={backArrow} style={[styles.backImg]} />
                            </TouchableOpacity>
                            <View style={styles.headerStyle}>
                                <Text style={styles.headerText}>SELECT ZONE/BRANCH</Text>
                            </View>
                        </View>
                        <View style={styles.pad5}>
                            <PickerComponent clearOnChange={true} selectedItem={formData.organization} onValueChange={(text) => { handleZoneForm(text, 'organization') }} data={organizations} placeholder='Organization' />
                            {
                                checkValidation === true && formData.organization === '' && <ErrorMessage errorMessage={'Required'} />
                            }
                        </View>
                        <View style={styles.pad5}>
                            <PickerComponent clearOnChange={true} selectedItem={formData.region} onValueChange={(text) => { handleZoneForm(text, 'region'); fetchZones(text) }} data={regions} placeholder='Region' />
                            {
                                checkValidation === true && formData.region === '' && <ErrorMessage errorMessage={'Required'} />
                            }
                        </View>
                        <View style={styles.pad5}>
                            <PickerComponent clearOnChange={true} selectedItem={formData.zone} onValueChange={(text) => { handleZoneForm(text, 'zone') }} data={zones} placeholder='Zone/Branch' />
                            {
                                checkValidation === true && formData.zone === '' && <ErrorMessage errorMessage={'Required'} />
                            }
                        </View>
                        <View style={[AppStyles.mainInputWrap, styles.btnWrap]}>
                            <Button
                                onPress={() => { submitZoneFilter() }}
                                style={[AppStyles.formBtn, styles.btn1]}>
                                <Text style={AppStyles.btnText}>VIEW DASHBOARD</Text>
                            </Button>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user,
    }
}

export default connect(mapStateToProps)(ZoneFilter)