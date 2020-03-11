import React from 'react'
import { Image, View, ActivityIndicator } from 'react-native'


const Loader = (props) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {
                props.loading == true ?
                    <ActivityIndicator size="large" color="#484848" />
                    : <Image source={require('../../../assets/Images/no-result2.png')} style={{ width: 200, height: 200 }} />
            }
        </View>
    )
}

export default Loader;