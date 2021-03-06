import React from 'react'
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import styles from './style'
import personImg from '../../../assets/img/avatar.jpeg'
import arrowIcon from '../../../assets/img/targetArrow.png'
import UserAvatar from 'react-native-user-avatar'
import { formatPrice } from '../../PriceFormate'

class TargetTile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { id, dropDownFunction, armsUserId, dropDown, data, handleForm, onPress } = this.props
    return (
      <View style={[styles.mainTileWrap, dropDown && armsUserId === id && styles.removeHeight]}>
        {/* ******Main Content View */}
        <View style={styles.tileInline}>
          {/* *****Image View */}
          <View style={styles.avatarMain}>
            <UserAvatar size="55" name={data.firstName + '' + data.lastName} />
          </View>

          {/* *****Name View */}
          <View style={styles.contentMain}>
            <Text style={styles.name}>{data.firstName + ' ' + data.lastName}</Text>
            <Text style={styles.position}>{data.armsUserRole.subRole}</Text>
          </View>

          {/* *****Price View */}
          <TouchableOpacity style={[styles.priceView, dropDown && armsUserId === id && styles.boxShadow]} onPress={() => { dropDownFunction(id) }}>
            <Text style={styles.targetText}>Target</Text>
            <Text style={styles.priceText}>{data.armsUserTargets.length > 0 && formatPrice(data.armsUserTargets[0].targetAmount)}</Text>
          </TouchableOpacity>

        </View>
        <View style={styles.inputTarget}>
          <TextInput placeholderTextColor={'#a8a8aa'} style={styles.formControl} placeholder={'Set New Target'} onChangeText={(text) => handleForm(text, 'targetAmount')} keyboardType={"number-pad"} />
          <TouchableOpacity onPress={() => onPress(data.armsUserTargets.length > 0 ? data.armsUserTargets[0].id : null)} style={styles.arrowIcon}>
            <Image source={arrowIcon} style={styles.arrowImgWidth} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default TargetTile;