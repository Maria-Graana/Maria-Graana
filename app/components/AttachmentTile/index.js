import React from 'react'
import { View, Text } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import AppStyles from '../../AppStyles';
import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

const AttachmentTile = (props) => {
    const { data, deleteAttachment } = props
    return (
        <View style={styles.mainContainer} >

            {/*   First Row    */}

            <View style={styles.horizontalContainer}>
                <Text style={styles.headingStyle}>{data.title}</Text>
                <TouchableOpacity onPress={() => deleteAttachment(data)} activeOpacity={0.7} >
                    <AntDesign name="close" size={18} color={AppStyles.colors.subTextColor} />
                </TouchableOpacity>
            </View>

            {/*   Second Row    */}

            <View style={styles.horizontalContainer}>
                <Text style={styles.subHeadingStyle}>{data.fileName}</Text>
                <Text style={styles.dateTimeStyle}>{data.dateCreated}</Text>
            </View>
        </View>
    )
}

export default AttachmentTile
