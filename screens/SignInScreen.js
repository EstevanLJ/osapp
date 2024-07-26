import * as React from 'react';
import {
  AsyncStorage,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  StyleSheet,
  StatusBar
} from 'react-native';
import AuthContext from '../contexts/authContext';
import Api from '../services/api';
import * as SecureStore from 'expo-secure-store';
import CheckBox from '../components/CheckBox';
import { store } from '../contexts/authStore';
import Constants from 'expo-constants';

import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

function SignInScreen() {

  const { state, dispatch } = React.useContext(store);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      let remember = await SecureStore.getItemAsync('remember');
      if (remember === '1') {
        let password = await SecureStore.getItemAsync('password');
        let username = await SecureStore.getItemAsync('username');
        setUsername(username)
        setPassword(password)
        setRemember('1')
      }
      setLoading(false);
    })();
  }, [])

  const permissoes = async () => {
    const camera = await Camera.requestPermissionsAsync();
    const location = await Location.requestPermissionsAsync();

    if (camera.status !== 'granted' || location.status !== 'granted') {
      return false;
    }

    return true;
  }

  const signIn = async () => {

    let permissoesOk = await permissoes();

    if (!permissoesOk) {
      Alert.alert(
        'Atenção!',
        'Você precisa aceitar as permissões de uso de câmera e de GPS para prosseguir.',
        [
          { text: 'OK' },
        ],
        { cancelable: false }
      );
      return;
    }

    setLoading(true);

    try {

      await SecureStore.setItemAsync('username', username);
      await SecureStore.setItemAsync('password', password);
      await SecureStore.setItemAsync('remember', remember ? '1' : '0');

      let api = new Api;
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

    } catch (error) {
      console.log(error)

      let userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        Alert.alert(
          'Atenção!',
          'Você está sem conexão com a internet. Deseja entrar no modo offline?',
          [
            {
              text: 'Não',
              onPress: () => {
                setError(true);
              }
            },
            {
              text: 'Sim', 
              onPress: () => {
                dispatch({
                  type: 'SIGN_IN',
                  token: null,
                  deviceId: Constants.installationId,
                  userInfo: JSON.parse(userInfo)
                });
              }
            },
          ],
          { cancelable: false }
        );
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView>

      <StatusBar backgroundColor={'#fff'} hidden={false} barStyle="dark-content" />

      <Image source={require('../assets/logo_decor.png')} style={styles.logo} />

      <Text style={{alignSelf: 'center', fontSize: 20, fontWeight: 'bold'}}>APR Digital</Text>

      <View style={{ justifyContent: 'center', flexDirection: 'row', marginBottom: 10 }}>
        {error &&
          <Text style={{ color: 'red' }}>Usuário ou senha inválidos!</Text>
        }
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={username}
          keyboardType={'email-address'}
          autoCapitalize={'none'}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={{ flexDirection: 'row', marginHorizontal: 15, alignItems: 'center', marginBottom: 20 }}>
        <CheckBox
          value={remember}
          checkColor="#346cb0"
          iconColor="#346cb0"
          onChange={() => setRemember(!remember)}
        />
        <Text onPress={() => setRemember(!remember)}>Lembrar</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => signIn()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Carregando...' : 'Login'}</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  logo: {
    // width: 150,
    // height: 150,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 20
  },

  inputContainer: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 4,
    padding: 5,
    marginHorizontal: 15,
    marginVertical: 5
  },

  input: {
    fontSize: 16
  },

  buttonContainer: {
    marginHorizontal: 15,
    marginVertical: 5,
    backgroundColor: '#017cf8',
    padding: 10,
    borderRadius: 4,
  },

  button: {
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  }
})

export default SignInScreen;