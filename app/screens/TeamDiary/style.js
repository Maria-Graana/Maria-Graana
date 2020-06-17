import { StyleSheet, Platform } from 'react-native'
export default styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingRight:0,
        paddingLeft:0,
    },
    searchMainContainerStyle:{
        backgroundColor: '#FFFFFF',
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'lightgrey',
        shadowOpacity: 1,
        elevation: 5,
    },
    searchTextContainerStyle:{
        flexDirection:'row',
        marginHorizontal: 15,
        borderRadius: 32,
        alignItems: 'center',
        marginVertical: 10,
        borderColor: 'grey',
        borderWidth: 0.5,
    },
    searchTextInput : {
        width:'90%',
        paddingVertical:Platform.OS==='android' ? 5 : 10, 
        paddingHorizontal:15
    },
});