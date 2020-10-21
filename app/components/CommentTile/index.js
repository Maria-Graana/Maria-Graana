import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import AppStyles from '../../AppStyles';
import styles from './styles';
import moment from 'moment';

const AttachmentTile = (props) => {
    const { data, deleteComment, property } = props
    return (
        <View style={styles.mainContainer} >
            {/*   First Row    */}
            <TouchableOpacity style={{ position: 'absolute', right: 5, top: 5 }} onPress={() => deleteComment(data.id)} activeOpacity={0.7} >
                <AntDesign name="close" size={18} color={AppStyles.colors.subTextColor} />
            </TouchableOpacity>
            <View style={styles.horizontalContainer}>
                <Text style={styles.headingStyle}>{data.value}</Text>
            </View>
            {
                property ?
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={[styles.dateTimeStyle, { color: AppStyles.colors.primaryColor }]}>{data.title && data.title.toLocaleUpperCase()}</Text>
                        <Text style={styles.dateTimeStyle}>{moment(data.createdAt).format('hh:mm A, MMMM DD, YYYY')}</Text>
                    </View>
                    :
                    <Text style={styles.dateTimeStyle}>{moment(data.createdAt).format('hh:mm A, MMMM DD, YYYY')}</Text>
            }

        </View>
    )
}

export default AttachmentTile
