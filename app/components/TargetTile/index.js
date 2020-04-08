import React from 'react'
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import styles from './style'
import personImg from '../../../assets/img/avatar.jpeg'
import arrowIcon from '../../../assets/img/targetArrow.png'

class TargetTile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { id, dropDownFunction, dropDownId, dropDown } = this.props
    return (
      <View style={[styles.mainTileWrap, dropDown && dropDownId === id && styles.removeHeight]}>
        {/* ******Main Content View */}
        <View style={styles.tileInline}>
          {/* *****Image View */}
          <View style={styles.avatarMain}>
            <Image source={personImg} style={styles.avatarImg} />
          </View>

          {/* *****Name View */}
          <View style={styles.contentMain}>
            <Text style={styles.name}>Irfan Lashari</Text>
            <Text style={styles.position}>Zonal Sales Manager</Text>
          </View>

          {/* *****Price View */}
          <TouchableOpacity style={[styles.priceView, dropDown && dropDownId === id && styles.boxShadow]} onPress={() => { dropDownFunction(id) }}>
            <Text style={styles.targetText}>Target</Text>
            <Text style={styles.priceText}>1.5 CRORE</Text>
          </TouchableOpacity>

        </View>
        <View style={styles.inputTarget}>
          <TextInput style={styles.formControl} placeholder={'Set New Target'} />
          <TouchableOpacity style={styles.arrowIcon}>
            <Image source={arrowIcon} style={styles.arrowImgWidth}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default TargetTile;