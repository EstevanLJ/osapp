# Service Order App - Mobile

This is the mobile component of this Service Order App. It was developed with React Native and built with Expo

The main feature of this app consist in creating Service Orders that can be accessed in the [Web Portal](https://github.com/EstevanLJ/osapp-portal)

Important Features:
* You can take pictures within the app and crop the images
* Image compression for network optimization
* Uses devices GPS feature to precisely inform where the photo was taken
* The app works offline and auto-sync the SO when you are back online
* Securely store the credentials with cryptography


## Libraries Used

- Setup: https://reactnative.dev/docs/environment-setup
- Login Workflow: https://reactnavigation.org/docs/auth-flow
- NativeBase: https://docs.nativebase.io/
- Reactotron: https://github.com/infinitered/reactotron
- Reactotron + Expo: https://shift.infinite.red/start-using-reactotron-in-your-expo-project-today-in-3-easy-steps-a03d11032a7a
- https://realm.io/blog/introducing-realm-react-native/
- https://iconify.design/icon-sets/ion/
- https://docs.expo.io/versions/latest/sdk/camera/


## Helpful Video Tutorials

- Realm: https://www.youtube.com/watch?v=y5Hv7pMA1uo
- Camera: https://www.youtube.com/watch?v=h8ukVeuzHEY


## Expo Packages Used

- Network: https://docs.expo.io/versions/v37.0.0/sdk/network/
- Location: https://docs.expo.io/versions/v37.0.0/sdk/location/
- Camera: https://docs.expo.io/versions/v37.0.0/sdk/camera/
- Device: https://docs.expo.io/versions/v37.0.0/sdk/device/ (Used for retrieving devices information, like OS and OS version)
- SecureStore: https://docs.expo.io/versions/v37.0.0/sdk/securestore/ (Key-value secure storage)
- ImageManipulator: https://docs.expo.io/versions/v37.0.0/sdk/imagemanipulator/
- BackgroudFetch: https://docs.expo.io/versions/v37.0.0/sdk/background-fetch/ (Used for offline sync)