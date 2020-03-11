import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    container: {
        backgroundColor : '#F8F8F8', 
        padding : 10, 
        // flexDirection : 'row', 
        marginBottom : 10, 
        marginRight :10,
        // flex: 1
    },
    timeWrap: {
        padding: 10,
        paddingLeft: 0,
        // flex: 1
    },
    timeText: {
        color : '#49BE58'
    },
    tileWrap: {
        flex : 2, 
        marginVertical: 5,
        backgroundColor: '#ffffff', 
        padding: 10, 
        borderLeftWidth : 3,
        borderLeftColor: '#ECB73F'
    },
    innerTile: {
        flexDirection : 'row', 
        marginBottom : 10, 
        alignItems : 'center'
    },
    meetingWrap: {
        flex : 1
    },
    midView: {
        backgroundColor:'#ECB73F', 
        height : 10,
        width : 10, 
        borderRadius: 5
    },
    innerView: {
        flexDirection:'row', 
        alignItems : 'center'
    },
    showTime: {
        paddingLeft : 10, 
        color : '#6E6E6E'
    },
    spaceView: {
        width : 12
    },
    meetingText: {
        paddingLeft : 10, 
        color : '#6E6E6E',
        // flexWrap: 'wrap',
        // flex: 1
    }
});