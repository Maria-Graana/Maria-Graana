import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect, useDispatch } from 'react-redux'
import { setInstrumentInformation } from '../../actions/addInstrument'
import SimpleInputText from '../SimpleInputField'
import PickerComponent from '../Picker/index'
import AppStyles from '../../AppStyles'

const AddEditInstrument = ({
    instruments,
    handleInstrumentInfoChange,
    instrument,
    enabled
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
                                        }}
                                        data={instrumentNumbers}
                                        name={'instrumentNumberPicker'}
                                        enabled={instrumentNumbers && instrumentNumbers.length > 0 && enabled}
                                        placeholder={instrumentNumbers && instrumentNumbers.length > 0 ? "Select Instrument Number" : 'No Option Available'}
                                        selectedItem={instrument.instrumentNo}
                                    />
                                </View>
                            </View> :
                            <SimpleInputText
                                editable={instrument.editable && enabled}
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
                    manualInstrumentSelect ?
                        <TouchableOpacity
                        disabled={!enabled}
                        style={[styles.row,
                            { width: '25%', justifyContent:'center' }
                            ]}
                         onPress={() => {
                            dispatch(setInstrumentInformation({ // clear selection
                                ...instrument,
                                instrumentNo: null,
                                instrumentAmount: null,
                                id: null,
                                editable: true,
                            }));
                            setManualInstrumentSelected(!manualInstrumentSelect)
                        }}>
                            <Text style={styles.clearText}>Clear</Text>
                        </TouchableOpacity>

                        : <TouchableOpacity
                            disabled={!enabled}
                            style={[styles.row,
                            { width: '25%', justifyContent: 'space-between' }
                            ]}
                            onPress={() =>  setManualInstrumentSelected(!manualInstrumentSelect)}>
                            <Text style={styles.orText}>Or</Text>
                            <Text style={styles.selectText}>Select</Text>
                        </TouchableOpacity>
                }
            </View>


            <SimpleInputText
                editable={instrument.editable && enabled}
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
    orText: {
        fontSize: AppStyles.fontSize.medium,
        fontFamily: AppStyles.fonts.defaultFont,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginLeft: 10,
    },
    selectText: {
        marginRight: 10,
        textDecorationLine: 'underline',
        fontSize: AppStyles.fontSize.medium,
        fontFamily: AppStyles.fonts.defaultFont,
        textAlign: 'center',
    },
    clearText: {
        marginRight: 10,
        textDecorationLine: 'underline',
        fontSize: AppStyles.fontSize.medium,
        fontFamily: AppStyles.fonts.defaultFont,
        textAlign: 'center',
    }
})
