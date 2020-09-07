import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF'
    },
    headingText: {
        fontSize: AppStyles.noramlSize.fontSize, 
        padding: 5,
        paddingBottom: 0,
        fontFamily: AppStyles.fonts.defaultFont
    },
    labelText: {
        fontSize: 20, 
        padding: 5,
        fontFamily: AppStyles.fonts.lightFont
    },
    outerContainer: { 
        flex: 1, 
        backgroundColor: 'white', 
        marginTop: 15, 
        marginBottom: 20, 
        flexDirection: 'row'
    },
    innerContainer: {
        flex: 1, 
        padding: 15,
    },
    pad: {
        position:'absolute',
        right:0,
        padding: 10
    },
    imageStyle: {
        width: wp('35%'),
        height: 100,
        borderWidth: 0.1,
        borderRadius: 4,
        marginVertical:10,
        marginHorizontal:5,
        borderColor: AppStyles.colors.backgroundColor,
      },
      statusText: {
        position:'absolute',
        right:15,
        top:50,
        fontFamily: AppStyles.fonts.boldFont,
        width: '25%',
        textAlign: 'center',
        alignSelf:'center',
        fontSize: AppStyles.noramlSize.fontSize,
        padding: 3,
        color: AppStyles.colors.primaryColor,
        borderRadius: 12,
        borderColor: AppStyles.colors.primaryColor,
        borderWidth: 0.5
    },
    featureOpacity: {
        flexDirection: "row",
        width: '50%',
        alignItems: 'center',
        padding: 5,
        marginTop:5,
    },
    featureText: {
        fontSize: 12,
        color: AppStyles.colors.textColor,
    },
});