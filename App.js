import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthStateProvider } from './contexts/authStore'
import Router from './Router'

function App() {

  return (
    <NavigationContainer>
      <AuthStateProvider>
        <Router />
      </AuthStateProvider>
    </NavigationContainer>
  );
}

export default App;