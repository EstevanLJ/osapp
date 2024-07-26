import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
})

function ParecerFinal(props) {

  return (
    <View style={styles.container}>

        <Text style={styles.title}>Parecer Final sobre a APR</Text>

    </View>
  );
}

export default ParecerFinal;