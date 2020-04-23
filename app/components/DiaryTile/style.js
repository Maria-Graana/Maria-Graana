import AppStyles from '../../AppStyles'
import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    container: {
        backgroundColor: AppStyles.colors.backgroundColor,
        paddingHorizontal: 15,
        paddingVertical: 10,
        // flexDirection : 'row', 
        marginBottom: 10,
        // flex: 1
    },
    timeWrap: {
        padding: 5,
        paddingLeft: 0,
    },
    timeText: {
        fontFamily: AppStyles.fonts.boldFont,
    },
    tileWrap: {
        flex: 1,
        marginVertical: 5,
        elevation: 10,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'lightgrey',
        shadowOpacity: 1,
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 4,
        borderLeftWidth: 3,
        borderLeftColor: AppStyles.colors.primaryColor
    },
    innerTile: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    meetingWrap: {
        flex: 1
    },
    midView: {
        backgroundColor: '#ECB73F',
        height: 10,
        width: 10,
        borderRadius: 5
    },
    innerView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    showTime: {
        fontFamily: AppStyles.fonts.defaultFont,
        paddingLeft: 5,
        color: AppStyles.colors.textColor
    },

    lead: {
        fontFamily: AppStyles.fonts.boldFont,
        width: '25%',
        textAlign: 'center',
        fontSize: 12,
        padding: 3,
        color: AppStyles.colors.textColor,
        borderRadius: 12,
        borderColor: AppStyles.colors.textColor,
        borderWidth: 0.5
    },
    leadText: {
        fontSize: 12,
        fontFamily: AppStyles.fonts.semiBoldFont,
        color: AppStyles.colors.textColor,
        textAlign: 'center',
    },
    statusText: {
        fontFamily: AppStyles.fonts.boldFont,
        // width: '25%',
        textAlign: 'center',
        fontSize: 10,
        padding: 3,
        paddingHorizontal:5,
        paddingVertical: 5,
        color: AppStyles.colors.primaryColor,
        borderRadius: 100,
        borderColor: AppStyles.colors.primaryColor,
        borderWidth: 0.5
    },
    spaceView: {
        width: 12
    },
    meetingText: {
        fontFamily: AppStyles.fonts.defaultFont,
        paddingHorizontal: 5,
        paddingVertical: 3,
        color: AppStyles.colors.textColor,
    }
});