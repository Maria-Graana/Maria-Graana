import AppStyles from '../../AppStyles'
export default styles = {
    calendarTheme: {
        backgroundColor: '#ffffff',
        calendarBackground: '#0f73ee',
        selectedDayTextColor: AppStyles.colors.textColor,
        selectedDayBackgroundColor: 'white',
        textDayFontFamily: AppStyles.fonts.defaultFont,
        textMonthFontFamily: AppStyles.fonts.defaultFont,
        textDayHeaderFontFamily: AppStyles.fonts.defaultFont,
        todayTextColor: AppStyles.colors.textColor,
        textDayFontSize: 14,
        textMonthFontSize: 14,
        textDayHeaderFontSize: 14,
        monthTextColor: 'white',
        arrowColor: 'white',
        dayTextColor: 'white',
        dotColor: '#FF0000',
        selectedDotColor: '#FF0000',
        textSectionTitleColor: 'white'
    },
    buttonShadowView: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: -15,
        marginTop: 10,
        borderRadius: 32,
        height: 40,
        width: 40,
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
        elevation: 10,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'lightgrey',
        shadowOpacity: 1,
    }
}