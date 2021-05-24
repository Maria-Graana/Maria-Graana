import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { connect, useDispatch } from 'react-redux'
import { setInstrumentInformation } from '../../actions/addInstrument'
import SimpleInputText from '../SimpleInputField'
import PickerComponent from '../Picker/index'
import AppStyles from '../../AppStyles'

const AddEditInstrument = ({ 
    instruments,
    handleInstrumentInfoChange,
    instrument,
}) => {
    const dispatch = useDispatch()
    const [manualInstrumentSelect, setManualInstrumentSelected] = useState(false);
    let instrumentNumbers = []
    if (instruments) {
        instruments.map((item) => {
            return instrumentNumbers.push({
                name: item.instrumentNo,
                value: item.instrumentNo,
            })
        })
    }
    return (
        <>
            <View style={styles.row}>
                <View style={styles.instrumentNumberContainer}>
                    {
                        manualInstrumentSelect ?
                            <View style={[AppStyles.mainInputWrap]}>
                                <View style={[AppStyles.inputWrap]}>
                                    <PickerComponent
                                        onValueChange={(itemValue, name) => {
                                            handleInstrumentInfoChange(itemValue, name);
                                            setManualInstrumentSelected(false);
                                        }}
                                        data={instrumentNumbers}
                                        name={'instrumentNumber'}
                                        placeholder="Select Instrument Number"
                                        selectedItem={instrument.instrumentNo}
                                    />
                                </View>
                            </View> :
                            <SimpleInputText
                                editable={instrument.editable}
                                name={'instrumentNumber'}
                                fromatName={false}
                                placeholder={'Enter Instrument Number'}
                                label={'INSTRUMENT NUMBER'}
                                value={instrument.instrumentNo}
                                keyboardType={'numeric'}
                                onChangeHandle={handleInstrumentInfoChange}
                            />
                    }

                </View>
                {
                    !instrument.id &&  <Text style={styles.orText}>Or</Text>
                }
               
                <Text onPress={() => {
                    if (instrument && instrument.id)
                        dispatch(setInstrumentInformation({ // clear selection
                            ...instrument,
                            instrumentNo: null,
                            instrumentAmount: null,
                            id: null,
                            editable: true,
                        }));
                    else
                        setManualInstrumentSelected(!manualInstrumentSelect) // manual selection of instrument
                }} style={[styles.selectText,{width: instrument.id ? '25%' : '16%'}]}>{instrument.id ? 'Clear' : 'Select'}</Text>
            </View>


            <SimpleInputText
                editable={instrument.editable}
                name={'instrumentAmount'}
                fromatName={false}
                placeholder={'Enter Instrument Amount'}
                label={'INSTRUMENT AMOUNT'}
                value={instrument.instrumentAmount}
                formatValue={instrument.instrumentAmount}
                keyboardType={'numeric'}
                onChangeHandle={handleInstrumentInfoChange}
            />
        </>
    )
}

mapStateToProps = (store) => {
    return {
        instruments: store.Instruments.instruments,
        instrument: store.Instruments.addInstrument,
    }
}

export default connect(mapStateToProps)(AddEditInstrument)


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    instrumentNumberContainer: {
        width: '75%'
    },
    orText:{
      width:'9%',
      fontSize: AppStyles.fontSize.medium,
      fontFamily: AppStyles.fonts.defaultFont,
      textAlign: 'center',
      textAlignVertical:'center'
    },
    selectText: {
        marginRight: 10,
        textDecorationLine: 'underline',
        fontSize: AppStyles.fontSize.medium,
        fontFamily: AppStyles.fonts.defaultFont,
        textAlign: 'center',
    }
})
