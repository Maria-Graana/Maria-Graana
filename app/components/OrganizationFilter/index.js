import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import listIconImg from '../../../assets/img/list-icon.png';
import { Menu } from 'react-native-paper';


class OrganizationFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }



    render() {
        const { visible, submitOrganization, openFilter, closeFilters } = this.props;

        return (
            <Menu
                visible={visible}
                onDismiss={closeFilters}
                style={{ marginTop: 30 }}
                contentStyle={{ width: 150 }}
                anchor={
                    <TouchableOpacity style={styles.inputBtn} onPress={() => { openFilter() }}>
                        <Image source={listIconImg} style={styles.regionImg} />
                    </TouchableOpacity>
                }
            >
                <Menu.Item onPress={() => { submitOrganization('2') }} title="Graana" />
                <Menu.Item onPress={() => { submitOrganization('1') }} title="Agency21" />
            </Menu>
        )
    }
}

const styles = StyleSheet.create({
    inputBtn: {
        paddingHorizontal: 10
    },
    regionImg: {
        resizeMode: 'contain',
        width: 14,
        height: 14,
        marginVertical: 6
    }
})

export default OrganizationFilter;


