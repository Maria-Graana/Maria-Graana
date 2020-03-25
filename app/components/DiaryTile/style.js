import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

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
        marginTop: 6,
        marginLeft: 3,
        width: '25%',
        padding: 6,
        backgroundColor: AppStyles.colors.backgroundColor,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppStyles.colors.textColor
    },
    leadText: {
        fontSize: 12,
        fontFamily: AppStyles.fonts.boldFont,
        color: AppStyles.colors.textColor,
        textAlign: 'center',
    },
    statusText: {
        fontFamily: AppStyles.fonts.boldFont,
        width: '25%',
        textAlign: 'center',
        fontSize: 12,
        padding: 3,
        color: AppStyles.colors.primaryColor,
        borderRadius: 12,
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