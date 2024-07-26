import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text } from 'react-native'

import HomeScreen from './screens/HomeScreen';
import FormularioScreen from './screens/FormularioScreen';
import SignInScreen from './screens/SignInScreen';
import DatabaseInit from './services/database-initializer';

import { store } from './contexts/authStore'

const Drawer = createDrawerNavigator();

function Router() {

  const [loading, setLoading] = React.useState(true);
  const { state } = React.useContext(store)

  React.useEffect(() => {
    new DatabaseInit
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={{ justifyContent: 'center', flexDirection: 'row', marginBottom: 10 }}>
        <Text>Carregando...</Text>
      </View>
    )
  }

  return (
    <>
      {!state.authenticated ? (
        <SignInScreen />
      ) : (
          <Drawer.Navigator>
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Formulario" component={FormularioScreen} />
            {/* <Drawer.Screen name="Camera" component={CameraScreen} /> */}
          </Drawer.Navigator>
        )}
    </>
  );
}

export default Router;