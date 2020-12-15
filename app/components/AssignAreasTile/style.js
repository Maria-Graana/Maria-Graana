import { StyleSheet } from 'react-native'
export default styles = StyleSheet.create({
    mainTile: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eaeaea',
        paddingTop: 10,
        paddingBottom: 10,
    },
    leftWrap: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countStyle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0f73ee',
        borderWidth: 1,
        borderColor: '#0f73ee',
        width: 35,
        height: 35,
        borderRadius: 50,
        textAlign: 'center',
        paddingTop: 8,
    },
    rightWrap: {
        padding: 10,
    },
    cityName: {
        fontSize: 16,
        textTransform: 'capitalize',
    },
    areaName: {
        fontSize: 14,
        color: '#70757a',
        textTransform: 'capitalize',
    },
});