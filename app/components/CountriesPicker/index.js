import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';

const CountriesPicker = props => {
  const [visible, setVisible] = useState(false)
  const onSelect = (country, name) => {
    props.handleForm(country.name,name)
    setVisible(false);
  }

  return (
    <View >
      {visible &&
        <CountryPicker
          onSelect={(country) => onSelect(country, props.name)}
          visible={visible}
          onClose={() => setVisible(false)}
          withFilter
        />}

      <TouchableOpacity

        style={[props.style, { justifyContent: 'center' }]}
        onPress={() => setVisible(true)}>
        <Text style={styles.innerText}>{props.country ? props.country : 'Select Country'}</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  innerText: {
    color: '#1d1d26',
    fontFamily: 'OpenSans_regular',
  }

});

export default CountriesPicker;





