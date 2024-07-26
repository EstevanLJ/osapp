import * as React from 'react';
import { View, Text, TouchableOpacity, Alert, StatusBar, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native';
import FormularioCrud from '../services/FormularioCrud';
import Constants from "expo-constants";
import { FontAwesome } from '@expo/vector-icons';
import { store } from '../contexts/authStore';
import Api from '../services/api';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';

import { dateToString } from '../utils/date';

function HomeScreen({ route, navigation }) {

  const [formularios, setFormularios] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('Enviando');
  const [online, setOnline] = React.useState(false);
  const { state, dispatch } = React.useContext(store);

  React.useEffect(() => {
    (async () => {
      let location = await Location.getCurrentPositionAsync({});
    })();
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await atualizar();
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    setOnline(state.userToken !== null);
  }, [state.userToken]);

  const atualizar = async () => {
    let response = await FormularioCrud.naoSincronizados()
    setFormularios(response._array);

    return response._array;
  }

  const sincronizar = async () => {
    let forms = await atualizar();

    if (forms.length === 0) {
      setLoading(false);
      Alert.alert(
        'Atenção!',
        'Nenhum formulário para sincronizar!',
        [
          { text: 'OK' },
        ],
        { cancelable: false }
      );
      return;
    }

    setLoading(true);

    let total = forms.length
    let atual = 0
    setLoadingMessage(`Enviando ${atual + 1} de ${total}`);

    try {

      if (state.userToken === null) {
        throw new Error('Você precisa se autenticar');
      }

      let form = Object.assign({}, forms[0]);
      let fotos = JSON.parse(form.fotos);
      let newFotos = []
      
      for (let index = 0; index < fotos.length; index++) {
        let foto = fotos[index];
        let newFoto = {...foto}

        if (foto.value) {
          let conteudo = await FileSystem.readAsStringAsync(foto.value.uri, {
            encoding: FileSystem.EncodingType.Base64
          });
          newFoto.value.base64 = conteudo
        }

        newFotos.push(newFoto);
      }
      
      form.fotos = JSON.stringify(newFotos);
      let api = new Api;
      let res = await api.enviarFormulario(state.userToken, form, (e) => {
        setLoadingMessage('Enviando ' + Math.floor(100 * e.loaded / e.total) + '%');
      })

      if (res.data.id) {
        await FormularioCrud.sincronizado(forms[0].id, res.data.id, dateToString(new Date()));
      }

      Alert.alert(
        'Sucesso!',
        'Seu formulário foi registrado e enviado com sucesso!',
        [
          { text: 'OK', onPress: () => {
            sincronizar()
          } },
        ],
        { cancelable: false }
      );

    } catch (error) {

      console.log(error)

      Alert.alert(
        'Falha!',
        'Não foi possível sincronizar agora',
        [
          { text: 'Cancelar' },
        ],
        { cancelable: false }
      );

    } finally {
      setLoading(false);
      atualizar();
    }

  }

  const verificarConexao = async () => {

    try {
      setLoadingMessage('Autenticando...');
      setLoading(true);

      let api = new Api;
      let password = await SecureStore.getItemAsync('password');
      let username = await SecureStore.getItemAsync('username');
      let res = await api.login(username, password);
      await AsyncStorage.setItem('userToken', res.data.access_token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.user));
      await AsyncStorage.setItem('deviceId', Constants.installationId);

      dispatch({
        type: 'SIGN_IN',
        token: res.data.access_token,
        deviceId: Constants.installationId,
        userInfo: res.data.user
      });

      Alert.alert(
        'Sucesso!',
        'Conectado com sucesso!',
        [
          { text: 'ok' },
        ],
        { cancelable: false }
      );

    } catch (error) {
      setOnline(false)
      Alert.alert(
        'Falha!',
        'Não foi possível se conectar. Tente novamente mais tarde.',
        [
          { text: 'ok' },
        ],
        { cancelable: false }
      );
    } finally {
      setLoading(false);
    }

  }

  return (
    <View style={styles.container}>

      <StatusBar backgroundColor={'#346cb0'} hidden={false} barStyle="ligh-content" />

      <View style={styles.header}>

        <Text style={styles.title}>Olá, {state.userInfo && state.userInfo.name}</Text>

      </View>

      <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>

        {loading && (
          <View style={{ marginTop: 10 }}>
            <ActivityIndicator size="large" />
            <Text>{loadingMessage}</Text>
          </View>
        )}

        <Text style={{ fontSize: 18 }}>O que você deseja?</Text>

        <View style={{ justifyContent: 'space-evenly', alignItems: 'center' }}>

          <View style={styles.buttonsContainer}>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Formulario')}>
              <FontAwesome name="plus" size={23} color="#346cb0" />
              <Text style={styles.actionButtonText}>Novo</Text>
            </TouchableOpacity>

            <View style={{ width: 20 }}></View>

            <TouchableOpacity style={styles.actionButton} onPress={() => sincronizar()}>
              <FontAwesome name="refresh" size={23} color="#346cb0" />
              <Text style={styles.actionButtonText}>Sincronizar{formularios.length > 0 ? ` ${formularios.length}` : null}</Text>
            </TouchableOpacity>

          </View>


          <View style={styles.buttonsContainer}>

            <TouchableOpacity style={styles.actionButton} onPress={() => verificarConexao()}>
              <FontAwesome name={online ? 'link' : 'unlink'} size={23} color="#346cb0" />
              <Text style={styles.actionButtonText}>{online ? 'On-line' : 'Off-line'}</Text>
            </TouchableOpacity>

            <View style={{ width: 20 }}></View>

            <TouchableOpacity style={styles.actionButton} onPress={() => dispatch({ type: 'SIGN_OUT' })}>
              <FontAwesome name="sign-out" size={23} color="#346cb0" />
              <Text style={styles.actionButtonText}>Sair</Text>
            </TouchableOpacity>

          </View>

        </View>


        <View style={{ marginTop: 30 }}>
          <Text>Versão 1.1.3</Text>
        </View>

      </View>


    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  buttonsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row'
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff'
  },

  header: {
    backgroundColor: '#346cb0',
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    flexDirection: 'row'
  },

  actionButton: {
    flex: 1,
    // marginHorizontal: 15,
    backgroundColor: '#f6f7f9',

    borderColor: '#cacaca',
    borderWidth: 1,

    color: '#fff',
    height: 100,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },

  actionButtonText: {
    fontSize: 18,
    color: '#346cb0',
  }

})


export default HomeScreen;