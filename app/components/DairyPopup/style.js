import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    container: {
        minHeight: 130,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    topBar: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 15,
        backgroundColor: '#fafafa',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeWrap: {
        color: '#8c8c8c',
        fontWeight: 'bold',
    },
    closeStyle: {
        position: 'absolute',
        left:10,
        paddingVertical: 5

    },
    updateBtn: {
        position: 'absolute',
        right:10,
        paddingVertical: 5
    },
    viewWrap: {
        marginVertical: 5,
        marginHorizontal: 5,
        borderBottomWidth: 1,
        borderColor: '#ebebeb',
        // padding: 10
    },
    taskTypeText: {
        padding: 10,
        fontSize: 18,
        color: '#484848',
        paddingBottom: 5,
    },
    subjectWrap: {
        marginVertical: 5,
        marginHorizontal: 5,
        borderColor: '#ebebeb',
        // padding: 10
    },
    subjectText: {
        padding: 10,
        paddingBottom: 5,
        fontSize: 16,
        fontWeight: '300',
    },
    notesText: {
        padding: 10,
        paddingBottom: 5,
        fontSize: 16,
        fontWeight: '200',
    },
    btnWrap: {
        marginVertical: 5,
        marginHorizontal: 5,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'flex-end',
        justifyContent: 'space-around'
    },
    closeBtn: {
        backgroundColor: '#ffffff',
        height: 50,
        justifyContent: 'center',
        borderRadius: 5,
        width: 100,
        marginHorizontal: 5,
    },
    markBtn: {
        backgroundColor: '#ffffff',
        height: 45,
        justifyContent: 'center',
        borderRadius: 5,
        width: 100,
        marginHorizontal: 5
    },
    disabledBtnStyle: {
        opacity:0.3,
        height: 50,
        justifyContent: 'center',
        borderRadius: 5,
        width: 100,
        marginHorizontal: 5
    },
  
    disabledBtnText: {
        color:'#333',
        fontSize: 14 ,
    }

});