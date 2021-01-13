/** @format */

import React from 'react'
import { connect } from 'react-redux'
import { View, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native'
import { BarChart, PieChart } from 'react-native-chart-kit'
import StaticData from '../../StaticData'
import investmentReportTile from '../../../assets/img/investment-report-tile.png'
import buyrentReportTile from '../../../assets/img/buyrent-report-tile.png'
import styles from './style'
import DashboardTile from '../../components/DashboardTile'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  navigateTo = (label) => {
    this.props.navigation.navigate(label)
  }

  render() {
    const width = Dimensions.get('window').width
    const height = 220
    let chartConfig = {
      backgroundColor: '#e26a00',
      backgroundGradientFrom: '#fb8c00',
      backgroundGradientTo: '#ffa726',
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#ffa726',
      },
    }
    const graphStyle = {
      marginVertical: 8,
      ...chartConfig.style,
    }

    return (
      <View style={[AppStyles.mb1]}>
        {this.props.user.organization && this.props.user.organization.isPP ? (
          <DashboardTile
            image={buyrentReportTile}
            label={'RCMReport'}
            navigateTo={this.navigateTo}
          />
        ) : (
          <View>
            <DashboardTile
              image={investmentReportTile}
              label={'CMReport'}
              navigateTo={this.navigateTo}
            />
            <DashboardTile
              image={buyrentReportTile}
              label={'RCMReport'}
              navigateTo={this.navigateTo}
            />
          </View>
        )}
      </View>

      // <ScrollView>
      //     <BarChart
      //         width={width}
      //         height={height}
      //         data={StaticData.barCharData}
      //         chartConfig={chartConfig}
      //         style={graphStyle}
      //     />
      //     <PieChart
      //         data={StaticData.pieCharData}
      //         height={height}
      //         width={width}
      //         chartConfig={chartConfig}
      //         accessor="population"
      //         style={graphStyle}
      //     />
      // </ScrollView>
    )
  }
}

mapStateTopProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateTopProps)(Dashboard)
