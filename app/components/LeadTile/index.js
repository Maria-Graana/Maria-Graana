import { Image, Text, TouchableOpacity, View } from 'react-native'

import AppStyles from '../../AppStyles'
import moment from 'moment'
import React from 'react'
import phone from '../../../assets/img/phone2.png'
import styles from './style'
import helper from '../../helper';
class LeadTile extends React.Component {
  constructor(props) {
    super(props)
  }



  render() {
    const { data, navigateTo, callNumber, user } = this.props
    return (
      <TouchableOpacity onPress={() => { navigateTo(data) }}>

        <View style={[styles.tileMainWrap, data.readAt === null && user.id === data.assigned_to_armsuser_id && styles.selectedInventory]}>
          <View style={[styles.rightContentView]}>
            <View style={styles.topIcons}>
              <View>
                <Text style={[styles.tokenLabel, AppStyles.mrFive]}>
                  {
                    data.status === 'token' ?
                      <Text>DEAL SIGNED - TOKEN</Text>
                      :
                      data.status.split('_').join(' ').toUpperCase()
                  }
                </Text>
              </View>
              {/* <View>
                <TouchableOpacity style={styles.actionBtn} onPress={() => { callNumber(`tel:${data.customer && data.customer.phone}`) }}>
                  <Image
                    style={[styles.fireIcon, AppStyles.mlFive]}
                    source={phone}
                  />
                </TouchableOpacity>
              </View> */}
            </View>

            <View style={[styles.contentMainWrap]}>
              <View style={styles.leftContent}>
                {/* ****** Name Wrap */}
                <View style={[styles.contentMain, AppStyles.mbTen]}>
                  <Text style={[styles.largeText, AppStyles.darkColor]}>
                    {data.customer && data.customer.customerName && helper.capitalize(data.customer.customerName)}
                  </Text>
                </View>

                {/* ****** Price Wrap */}
                <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                  <Text style={[styles.priceText, styles.multiColumn, AppStyles.darkColor, AppStyles.mrTen]}>
                    PKR
            	 	</Text>
                  <Text style={[styles.priceText, styles.multiColumn, styles.priceColor]}>
                    {!data.projectId && data.min_price && helper.checkPrice(data.min_price) + ' - '} {!data.projectId && data.price && helper.checkPrice(data.price)}  {data.projectId && data.minPrice && helper.checkPrice(data.minPrice) + ' - '}{data.projectId && data.maxPrice && helper.checkPrice(data.maxPrice)}
                  </Text>
                </View>

                {/* ****** Address Wrap */}
                <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                  {
                    data.size != null && !data.projectId ?
                      <Text style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}>
                        {data.size !== 0 ? data.size + ' ' : null}{data.size_unit} {data.subtype} {data.purpose != null && 'for'} {data.purpose}
                      </Text>
                      :
                      <Text style={[AppStyles.darkColor]}>
                        {`${helper.capitalize(data.subtype)}${helper.capitalize(data.projectType)}`}
                      </Text>
                  }
                </View>

                {/* ****** Location Wrap */}
                <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                  <Text style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}>
                    {!data.projectId && data.armsLeadAreas && data.armsLeadAreas.length > 0 && data.armsLeadAreas[0].area.name + ', '}{!data.projectId && data.city && data.city.name}{data.projectId && data.project && helper.capitalize(data.project.name)}
                  </Text>
                </View>

                {/* ****** Location Wrap */}
                <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                  <Text style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}>
                    {moment(data.createdAt).format("MMM DD YYYY, hh:mm A")}
                  </Text>
                </View>
              </View>
              <View style={styles.phoneMain}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => { callNumber(`tel:${data.customer && data.customer.phone}`) }}>
                  <Image
                    style={[styles.fireIcon, AppStyles.mlFive]}
                    source={phone}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default LeadTile;