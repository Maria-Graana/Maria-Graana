import React from 'react';
import { Text } from 'react-native';
import { StyleSheet, Image } from 'react-native';
import AppStyles from '../../AppStyles';
import { Footer, FooterTab, Button, } from 'native-base';
import AgentImg from '../../../assets/img/agent.png';
import RegionImg from '../../../assets/img/region.png';
import TeamImg from '../../../assets/img/team.png';
import OragnizationImg from '../../../assets/img/oragnization.png';

class ReportFooter extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { label } = this.props
        return (
            <Footer>
                <FooterTab>
                    <Button style={label === 'Agent' ? styles.selectedButton : {}} vertical onPress={() => this.props.selectedFooterButton('Agent')}>
                        <Image source={AgentImg} style={label === 'Agent' ? styles.selectedImg : styles.imgStyle} />
                        <Text style={label === 'Agent' ? styles.selectedText : styles.textStyle}>Agent</Text>
                    </Button>
                    <Button style={label === 'Team' ? styles.selectedButton : {}} vertica onPress={() => this.props.selectedFooterButton('Team')}>
                        <Image source={TeamImg} style={label === 'Team' ? styles.selectedImg : styles.imgStyle} />
                        <Text style={label === 'Team' ? styles.selectedText : styles.textStyle}>Team</Text>
                    </Button>
                    <Button style={label === 'Region' ? styles.selectedButton : {}} vertical onPress={() => this.props.selectedFooterButton('Region')}>
                        <Image source={RegionImg} style={label === 'Region' ? styles.selectedImg : styles.imgStyle} />
                        <Text style={label === 'Region' ? styles.selectedText : styles.textStyle}>Region</Text>
                    </Button>
                    <Button style={label === 'Organization' ? styles.selectedButton : {}} vertical onPress={() => this.props.selectedFooterButton('Organization')}>
                        <Image source={OragnizationImg} style={label === 'Organization' ? styles.selectedImg : styles.imgStyle} />
                        <Text style={label === 'Organization' ? styles.selectedText : styles.textStyle}>Organization</Text>
                    </Button>
                </FooterTab>
            </Footer>
        )
    }
}

const styles = StyleSheet.create({
    imgStyle: {
        resizeMode: 'contain',
        width: 25,
        height: 25,
    },
    textStyle: {
        color: AppStyles.colors.textColor,
        padding: 1,
        fontFamily: AppStyles.fonts.defaultFont
    },
    selectedButton: {
        backgroundColor: AppStyles.colors.primaryColor
    },
    selectedText: {
        color: '#ffffff',
        padding: 1,
        fontFamily: AppStyles.fonts.defaultFont
    },
    selectedImg: {
        tintColor: '#ffffff',
        resizeMode: 'contain',
        width: 25,
        height: 25,
    }
})

export default ReportFooter;