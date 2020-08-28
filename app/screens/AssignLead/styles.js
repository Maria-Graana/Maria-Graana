import { StyleSheet } from 'react-native'
export default styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 0,
    },
    assignButtonStyle: {
        height: 50,
        alignSelf: 'center',
        marginBottom: 20,
        width: '95%',
        opacity: 0.9,
        backgroundColor: AppStyles.colors.primaryColor,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderRadius: 5
    },
    pickerStyle: {
        height: 40,
      },
      customIconStyle: {
        top: 14,
        fontSize: 15,
      },
      pickerMain: {
        marginVertical:10,
        borderWidth: 1,
        width:'95%',
        borderRadius: 20,
        borderColor: '#ebebeb',
        overflow:'hidden',
        alignSelf:'center',
      },
});