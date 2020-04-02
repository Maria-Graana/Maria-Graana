import React from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { Button, } from 'native-base';
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal';
import times from '../../../assets/img/times.png'
import addImg from '../../../assets/img/add.png'
import checkImg from '../../../assets/img/check.png'
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';

class OfferModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { openModal, active } = this.props
    return (
      <Modal isVisible={active} style={styles.widthModal}>
        <View style={[styles.modalMain]}>
          <TouchableOpacity style={styles.timesBtn} onPress={() => { openModal() }}>
            <Image source={times} style={styles.timesImg} />
          </TouchableOpacity>

          <View style={[styles.modalBody]}>

            {/* **************************************** */}
            <View style={[styles.mainTopHeader]}>
              {/* ******************Left Input */}
              <View style={styles.mainInputWrap}>
                <Text style={styles.offerColor}>My Offers</Text>
                <View style={styles.inputWrap}>
                  <TextInput style={[styles.formControl]} placeholder={'PKR 4.5 Crore'} />
                  <TouchableOpacity style={[styles.addBtnColorLeft, styles.sideBtnInput]}>
                    <Image source={addImg} style={[styles.addImg]} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* ******************Right Input */}
              <View style={styles.mainInputWrap}>
                <Text style={styles.offerColor}>Their Offers</Text>
                <View style={styles.inputWrap}>
                  <TextInput style={[styles.formControl]} placeholder={'PKR 4.5 Crore'} />
                  <TouchableOpacity style={[styles.addBtnColorRight, styles.sideBtnInput]}>
                    <Image source={addImg} style={[styles.addImg]} />
                  </TouchableOpacity>
                </View>
              </View>

            </View>


            {/* **************************************** */}
            <View style={[styles.chatContainer]}>
              <ScrollView >
                {/* ******** Left Side ******** */}
                <View>
                  <View style={[styles.mainChatWrap]}>
                    <View style={[styles.caret, styles.caretRight]}></View>
                    <Text style={[styles.priceStyle, styles.priceBlue]}>PKR 4.5 Crore</Text>
                    <Text style={[styles.dataTime]}>09:30 PM, MARCH 31</Text>
                  </View>
                </View>

                {/* ******** Right Side ******** */}
                <View style={[styles.alignRight]}>
                  <View style={[styles.mainChatWrap]}>
                    <View style={[styles.caret, styles.caretLeft]}></View>
                    <Text style={[styles.priceStyle, styles.priceBlack, styles.textRight]}>PKR 4.5 Crore</Text>
                    <Text style={[styles.dataTime, styles.textRight]}>09:30 PM, MARCH 31</Text>
                  </View>
                </View>


                {/* ******** Left Side ******** */}
                <View>
                  <View style={[styles.mainChatWrap]}>
                    <View style={[styles.caret, styles.caretRight]}></View>
                    <Text style={[styles.priceStyle, styles.priceBlue]}>PKR 4.5 Crore</Text>
                    <Text style={[styles.dataTime]}>09:30 PM, MARCH 31</Text>
                  </View>
                </View>

                {/* ******** Right Side ******** */}
                <View style={[styles.alignRight]}>
                  <View style={[styles.mainChatWrap]}>
                    <View style={[styles.caret, styles.caretLeft]}></View>
                    <Text style={[styles.priceStyle, styles.priceBlack, styles.textRight]}>PKR 4.5 Crore</Text>
                    <Text style={[styles.dataTime, styles.textRight]}>09:30 PM, MARCH 31</Text>
                  </View>
                </View>


                {/* ******** Left Side ******** */}
                <View>
                  <View style={[styles.mainChatWrap]}>
                    <View style={[styles.caret, styles.caretRight]}></View>
                    <Text style={[styles.priceStyle, styles.priceBlue]}>PKR 4.5 Crore</Text>
                    <Text style={[styles.dataTime]}>09:30 PM, MARCH 31</Text>
                  </View>
                </View>

                {/* ******** Right Side ******** */}
                <View style={[styles.alignRight]}>
                  <View style={[styles.mainChatWrap]}>
                    <View style={[styles.caret, styles.caretLeft]}></View>
                    <Text style={[styles.priceStyle, styles.priceBlack, styles.textRight]}>PKR 4.5 Crore</Text>
                    <Text style={[styles.dataTime, styles.textRight]}>09:30 PM, MARCH 31</Text>
                  </View>
                </View>


                {/* ******** Left Side ******** */}
                <View>
                  <View style={[styles.mainChatWrap]}>
                    <View style={[styles.caret, styles.caretRight]}></View>
                    <Text style={[styles.priceStyle, styles.priceBlue]}>PKR 4.5 Crore</Text>
                    <Text style={[styles.dataTime]}>09:30 PM, MARCH 31</Text>
                  </View>
                </View>

                {/* ******** Right Side ******** */}
                <View style={[styles.alignRight]}>
                  <View style={[styles.mainChatWrap]}>
                    <View style={[styles.caret, styles.caretLeft]}></View>
                    <Text style={[styles.priceStyle, styles.priceBlack, styles.textRight]}>PKR 4.5 Crore</Text>
                    <Text style={[styles.dataTime, styles.textRight]}>09:30 PM, MARCH 31</Text>
                  </View>
                </View>


                {/* ******** Left Side ******** */}
                <View>
                  <View style={[styles.mainChatWrap]}>
                    <View style={[styles.caret, styles.caretRight]}></View>
                    <Text style={[styles.priceStyle, styles.priceBlue]}>PKR 4.5 Crore</Text>
                    <Text style={[styles.dataTime]}>09:30 PM, MARCH 31</Text>
                  </View>
                </View>

                {/* ******** Right Side ******** */}
                <View style={[styles.alignRight]}>
                  <View style={[styles.mainChatWrap]}>
                    <View style={[styles.caret, styles.caretLeft]}></View>
                    <Text style={[styles.priceStyle, styles.priceBlack, styles.textRight]}>PKR 4.5 Crore</Text>
                    <Text style={[styles.dataTime, styles.textRight]}>09:30 PM, MARCH 31</Text>
                  </View>
                </View>




              </ScrollView>
            </View>



            {/* **************************************** */}
            <View style={styles.mainInputWraplast}>
              <Text style={styles.offerColorLast}>AGREED AMOUNT</Text>
              <View style={styles.inputWrapLast}>
                <TextInput style={[styles.formControlLast]} placeholder={'PKR 4.5 Crore'} />
                <TouchableOpacity style={[styles.addBtnColorLeft, styles.sideBtnInputLast]}>
                  <Image source={checkImg} style={[styles.checkImg]} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

export default OfferModal;