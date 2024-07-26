import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';

import { formatDate, formatTime } from '../../utils/date'

const styles = StyleSheet.create({
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
    backgroundColor: '#f6f7f9'
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    padding: 8,
    borderColor: 'rgba(20,20,31,.12)',
    borderWidth: 1,

    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  cardText: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    padding: 8,
    borderColor: 'rgba(20,20,31,.12)',
    borderWidth: 1,

  },

})

function InformacoesGerais(props) {

  const [showDataPicker, setShowDataPicker] = React.useState(false)
  const [showInicioPicker, setShowInicioPicker] = React.useState(false)
  const [showTerminoPicker, setShowTerminoPicker] = React.useState(false)

  const onChange = (index, value) => {
    props.onChange({
      ...props.value,
      [index]: value
    })
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Informações Gerais</Text>

      <View style={styles.card}>
        <Text>Data da atividade: {formatDate(props.value.data)}</Text>
        <TouchableOpacity onPress={() => setShowDataPicker(true)}>
          <FontAwesome name="calendar" size={26} color="#346cb0" />
        </TouchableOpacity>
        {showDataPicker &&
          <DateTimePicker
            value={props.value.data}
            mode={'date'}
            display="default"
            onChange={(e, selectedDate) => {
              setShowDataPicker(false)
              selectedDate && onChange('data', selectedDate)
            }}
          />
        }
      </View>

      <View style={styles.card}>
        <Text>Hora de início: {formatTime(props.value.inicio)}</Text>
        <TouchableOpacity onPress={() => setShowInicioPicker(true)}>
          <FontAwesome name="clock-o" size={26} color="#346cb0" />
        </TouchableOpacity>
        {showInicioPicker &&
          <DateTimePicker
            value={props.value.inicio}
            mode={'time'}
            display="default"
            is24Hour={true}
            onChange={(e, selectedDate) => {
              setShowInicioPicker(false)
              selectedDate && onChange('inicio', selectedDate)
            }}
          />
        }
      </View>

      <View style={styles.card}>
        <Text>Hora de término: {formatTime(props.value.termino)}</Text>
        <TouchableOpacity onPress={() => setShowTerminoPicker(true)}>
          <FontAwesome name="clock-o" size={26} color="#346cb0" />
        </TouchableOpacity>
        {showTerminoPicker &&
          <DateTimePicker
            value={props.value.termino}
            mode={'time'}
            display="default"
            is24Hour={true}
            onChange={(e, selectedDate) => {
              setShowTerminoPicker(false)
              selectedDate && onChange('termino', selectedDate)
            }}
          />
        }
      </View>


      <View style={styles.cardText}>
        <Text>Número da OS</Text>
        <TextInput
          value={props.value.numero_os}
          onChangeText={(text) => onChange('numero_os', text)}
          enablesReturnKeyAutomatically={true}
          style={{ height: 35, paddingHorizontal: 5, borderColor: '#ccc', borderWidth: 1 }} />
      </View>

      <View style={styles.cardText}>
        <Text>Descrição da atividade</Text>
        <TextInput
          value={props.value.atividade}
          onChangeText={(text) => onChange('atividade', text)}
          multiline={true}
          enablesReturnKeyAutomatically={true}
          style={{ height: 150, borderColor: '#ccc', borderWidth: 1 }} />
      </View>


    </View>
  );
}

export default InformacoesGerais;