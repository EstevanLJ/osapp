import React from 'react'

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...prevState,
        authenticated: true,
        userToken: action.token,
        userInfo: action.userInfo,
        deviceId: action.deviceId,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        authenticated: false,
        userToken: null,
        userInfo: null,
        deviceId: null
      };
  }
}

const initialState = {
  authenticated: false,
  userToken: null,
  userInfo: null,
  deviceId: null
}

const store = React.createContext(initialState)
const { Provider } = store

const AuthStateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  return <Provider value={{ state, dispatch }}>{children}</Provider>
};

export { 
  AuthStateProvider, 
  initialState, 
  store, 
  reducer, 
}