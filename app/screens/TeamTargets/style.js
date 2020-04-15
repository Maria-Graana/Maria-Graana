import { StyleSheet } from 'react-native';
export default styles = StyleSheet.create({
    targetMain: {
        marginTop: 10,
        elevation: 5,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#33333312',
        shadowOpacity: 1,
    },
    bgcWhite: {
        backgroundColor: '#fff'
    },
    formMain: {
        marginBottom: 15,
    },
    scrollViewHeight: {
        height: '75%'
    },
    titleMain: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 25,
        borderRadius: 4,
        marginTop: 20,
        elevation: 5,
        marginLeft:15,
        marginRight:15,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#33333312',
        shadowOpacity: 1,
    },
    labelText: {
        fontSize: 12,
        letterSpacing: 1.5,
        marginBottom: 3,
        fontWeight: '600'
    },
    priceText: {
        textAlign: 'right',
        color: '#1876EF',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 2,
    },
    input: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '100%',
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 4,
      },
      inputText: {
        fontSize: 16,
        // fontWeight: '500',
        marginLeft: 15
      },
})