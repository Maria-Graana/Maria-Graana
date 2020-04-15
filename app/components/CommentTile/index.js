import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import AppStyles from '../../AppStyles';
import styles from './styles';
import moment from 'moment';


const AttachmentTile = (props) => {
    const { data, deleteComment } = props
    return (
        <View style={styles.mainContainer} >

            {/*   First Row    */}
            <View style={styles.horizontalContainer}>
                <Text style={styles.headingStyle}>{data.value}</Text>
                <TouchableOpacity style={{ position: 'absolute', right: 0, top: 5, elevation: 10 }} onPress={() => deleteComment(data.id)} activeOpacity={0.7} >
                    <AntDesign name="close" size={18} color={AppStyles.colors.subTextColor} />
                </TouchableOpacity>
            </View>

            <Text style={styles.dateTimeStyle}>{moment(data.createdAt).format('hh:mm A, MMMM DD')}</Text>
        </View>
    )
}

export default AttachmentTile
