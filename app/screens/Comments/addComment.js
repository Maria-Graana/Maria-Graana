import React from 'react'
import { View, Text, } from 'react-native'
import { Button, Textarea } from 'native-base';
import AppStyles from '../../AppStyles';
import styles from './styles'

const AddComment = (props) => {
    const { comment,setComment, onPress } = props;
    return (

        <View style={styles.container}>
            <Textarea
                placeholderTextColor="#bfbbbb"
                style={[AppStyles.formControl, AppStyles.formFontSettings, { height: 150, paddingRight: 20,  
                    elevation: 10,
                    shadowOffset: { width: 5, height: 5 },
                    shadowColor: 'lightgrey',
                    shadowOpacity: 1, }]} rowSpan={10}
                placeholder="Add Comment"
                onChangeText={(text) => setComment(text)}
                value={comment}
            />

            <View style={styles.buttonStyle}>
                <Button onPress={onPress}
                    style={[AppStyles.formBtn]}>
                    <Text style={AppStyles.btnText}>ADD COMMENT</Text>
                </Button>
            </View>


        </View>



    )
}

export default AddComment
