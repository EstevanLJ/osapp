import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CheckBox from '../CheckBox';

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
    // padding: 5
  },
  container: {
    flex: 1,
    backgroundColor: '#f6f7f9',
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
    paddingTop: 8,
    paddingLeft: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1
  },
  checkboxLabel: {
    flexWrap: 'wrap',
    paddingRight: 50
  }
})

function AvalizacaoRisco(props) {

  const onPress = (index) => {
    let checklistClone = [].concat(props.value);
    checklistClone[index].checked = !checklistClone[index].checked;
    props.onChange(checklistClone)
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Avaliação dos Riscos</Text>

      <Text style={{ marginLeft: 8, marginBottom: 10 }}>Selecione todos que se aplicam:</Text>

      {props.value.map((item, index) => (
        <View style={styles.checkboxContainer} key={String(index)}>
          <CheckBox
            checkColor="#346cb0"
            iconColor="#346cb0"
            value={item.checked}
            onChange={() => onPress(index)}
          />
          <Text style={styles.checkboxLabel} onPress={() => onPress(index)}>{item.text}</Text>
        </View>
      ))}

    </View>
  );
}

export default AvalizacaoRisco;