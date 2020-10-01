import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import AppStyles from '../../AppStyles';
import styles from './styles';
import moment from 'moment';


const AttachmentTile = (props) => {
    const { data, deleteAttachment } = props
    return (
        <View style={styles.mainContainer} >

            {/*   First Row    */}

            <View style={styles.horizontalContainer}>
                <Text style={[styles.headingStyle, { flex: 0.9, marginRight: 10 }]}>{data && data.title.toUpperCase()}</Text>
                <TouchableOpacity style={{ flex: 0.1, alignItems: 'flex-end' }} onPress={() => deleteAttachment(data)} activeOpacity={0.7} >
                    <AntDesign name="close" size={18} color={AppStyles.colors.subTextColor} />
                </TouchableOpacity>
            </View>

            {/*   Second Row    */}

            <View style={styles.horizontalContainer}>
                <Text numberOfLines={1} style={[styles.subHeadingStyle, { flex: 0.6, marginRight: 5 }]}>{data && data.fileName}</Text>
                <Text style={[styles.dateTimeStyle, { flex: 0.4, textAlign: 'right'}]}>{moment(data && data.createdAt).format('hh:mm A, MMMM DD')}</Text>
            </View>
        </View>
    )
}

export default AttachmentTile
