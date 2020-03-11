import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default styles = StyleSheet.create({
    wrapper: {
        padding: 15, 
        alignItems: 'center', 
        borderRadius: 5
    },
    scrollViewWrapper: {
        marginTop: 70,
        flex: 1
    },
    avoidView: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
        flex:1
    },
    loginHeader: {
        fontSize: 28,
        color: 'white',
        fontWeight: "300",
        marginBottom: 40
    },
    wrapper: {
        display: "flex"
    },
    label: { 
        fontWeight: "700", 
        marginBottom: 10 
    },
    inputFiled: {
        borderBottomWidth: 1,
        paddingTop: 5,
        paddingBottom: 5
    },
    logo: {
        // flex: 1,
        width: "40%",
        resizeMode: "contain",
        // alignSelf: "center"
    },
    form: {
        flex: 1,
        justifyContent: "center",
        width: "100%"
    },
    checkLogin: {
        textAlign: "center",
        color: "white",
        fontSize: 17,
        opacity: 1
    },

    emailTextAlignment: {
        flex: 1,
        flexGrow: 1,
        flexDirection: 'row',
        alignSelf: "center",
        justifyContent: 'space-evenly',
        marginTop: "15%"
    },
    passwordTextAlignment: {
        flex: 1,
        flexGrow: 1,
        flexDirection: 'row',
        alignSelf: "center",
        justifyContent: 'space-evenly'
    },
    requiredText: {
        flexDirection: "row", 
        flexGrow: 2, 
        marginLeft: "15%"
    },
    profileImage: {
        width: 23, 
        height: 25, 
        marginRight: "2%",
    },
    lockImage: {
        width: 23, 
        height: 25, 
        marginRight: "2%",
    },
    infoImage: {
        tintColor: '#ffffff',
        width: 20, 
        height: 20,
        resizeMode : 'stretch',
        alignItems: 'center',        
    },
    requiredTextColor: {
        color: "red",
        paddingLeft : 50
    }
});