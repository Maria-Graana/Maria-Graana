import React from 'react'
import { Image } from 'react-native'

const NoResultsComponent = (props) => {
    const { imageSource } = props;
    return (
        <Image source={imageSource}
            style={{ flex: 1, alignSelf: 'center', resizeMode: 'contain', width: 300, height: 300 }} />
    )
}

export default NoResultsComponent
