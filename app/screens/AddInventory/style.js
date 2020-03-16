import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#f5f5f5',
        justifyContent: 'center'
    },
    TextProp: {
        fontSize: 20, 
        fontWeight: 'bold'
    },
    viewMargin: {
        marginTop : 20, 
        marginHorizontal: 10
    },
    textFieldProp: {
        padding: '5%',
        width: "100%"
    },
    requiredTextColor: {
        color: 'red',
        padding: 10
    },
    mainInputwrap:{
        position: 'relative',
    },
    formControl:{
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 4,
        paddingLeft: 15,
        minHeight: 40,
    },
    viewWrap: {
        flexDirection: 'row',
    },
    itemWrap: {
        backgroundColor: '#ffffff', 
        borderRadius: 5,
        marginVertical : 10,
        flex:1
    },
    close: {
        // margin: 5,
        position: "relative",
        top: 0,
        width: 25,
        height: 25,
        color: "red"
    },
    backGroundImg: {
        resizeMode: "contain", 
        width: 100, 
        height: 100,
        // marginBottom: 5
    },
    outerImageView: {
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        // marginVertical : 10, 
        // marginHorizontal: 15
    },
    innerImageView: {
        flex:1, 
        flexDirection: 'row', 
        justifyContent: 'space-evenly', 
        flexWrap: 'wrap', 
        // marginVertical : 10, 
        // marginHorizontal: 15
    },
    inputWrap: {
        // margin: 10,
        flexDirection: 'row'
    }
})