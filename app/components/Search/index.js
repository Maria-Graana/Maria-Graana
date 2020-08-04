import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';


const Search = ({ placeholder, searchText, setSearchText, showShadow = true, containerWidth = '100%', showClearButton = false, closeSearchBar, }) => {
    return (
        <View style={[styles.searchMainContainerStyle, { width: containerWidth }, showShadow ? styles.shadow : null]}>
            <View style={styles.searchTextContainerStyle}>
                <TextInput
                    style={styles.searchTextInput}
                    placeholder={placeholder}
                    value={searchText}
                    onChangeText={(value) => setSearchText(value)}
                />
                {
                    showClearButton ?
                        <Ionicons onPress={() => closeSearchBar()} name={'ios-close-circle-outline'} size={24} color={'grey'} />
                        :
                        <Ionicons name={'ios-search'} size={24} color={'grey'} />
                }
            </View>
        </View>
    )
}

export default Search

const styles = StyleSheet.create({
    searchMainContainerStyle: {
        backgroundColor: '#FFFFFF',
    },
    shadow: {
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'lightgrey',
        shadowOpacity: 1,
        elevation: 5,
    },
    searchTextContainerStyle: {
        flexDirection: 'row',
        marginHorizontal: 15,
        borderRadius: 32,
        alignItems: 'center',
        marginVertical: 10,
        borderColor: '#ebebeb',
        borderWidth: 1,
    },
    searchTextInput: {
        width: '90%',
        paddingVertical: Platform.OS === 'android' ? 5 : 10,
        paddingHorizontal: 15
    },
})
