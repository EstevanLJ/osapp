import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import PhotoInput from '../PhotoInput';
import Constants from "expo-constants";

const styles = StyleSheet.create({
  TextInputView: {
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'stretch'
  },
  title: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#f6f7f9'
  },
})

function Fotos(props) {

  const onChangePhoto = (photo, index) => {
    let formClone = [].concat(props.value);
    formClone[index].value = photo;
    props.onChange(formClone);
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Fotos</Text>

      {props.value.map((photo, index) => (
        <PhotoInput
          key={index}
          value={photo}
          label={photo.text}
          onChange={(p) => onChangePhoto(p, index)} />
      ))}

    </View>
  );
}

export default Fotos;