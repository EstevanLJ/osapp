import * as React from 'react';
import { SafeAreaView, View, Text, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';

const styles = StyleSheet.create({
  camera: {
    flex: 1
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row'
  },
  botaoTrocarCamera: {
    position: 'absolute',
    bottom: 20,
    left: 20
  },
  botaoTrocarCameraTexto: {
    fontSize: 20,
    marginBottom: 13,
    color: '#fff'
  },
  botaoTirarFoto: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    margin: 20,
    borderRadius: 10,
    height: 50
  }
})

function CameraScreen({ navigation }) {

  const cameraRef = React.useRef();
  const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back);
  const [pictureTaken, setPictureTaken] = React.useState(null);
  const [pictureModalOpen, setPictureModalOpen] = React.useState(false);
  const [cameraPermission, setCameraPermission] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);


  React.useEffect(() => {
    if (cameraRef.current) {
      (async () => {
        let ratio = await cameraRef.current.getSupportedRatiosAsync();
        let pictureSizes = await cameraRef.current.getAvailablePictureSizesAsync('16:9');
        console.log(ratio)
        console.log(pictureSizes)
      })();
    }
  }, [cameraRef.current]);

  async function takePicture() {
    if (cameraRef) {
      const picture = await cameraRef.current.takePictureAsync({ base64: false, exif: true });
      setPictureModalOpen(true);
      setPictureTaken(picture);
      console.log(picture)
    }
  }

  if (cameraPermission === null) {
    return <View><Text>Aceite a permissão</Text></View>
  }

  if (cameraPermission === false) {
    return <View><Text>Permissão negada</Text></View>
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Camera
        style={styles.camera}
        type={cameraType}
        ref={cameraRef}
        // ratio="16:9"
        // zoom={0}
        // flashMode={Camera.Constants.FlashMode.off}
        // autoFocus={false}
        // pictureSize="1280x720"
        // focusDepth={0.9}
        // useCamera2Api={true}
      >
        <View style={styles.cameraContainer} >
          <TouchableOpacity style={styles.botaoTrocarCamera} onPress={() => {
            setCameraType(
              cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            )
          }}>
            <Text style={styles.botaoTrocarCameraTexto}>Trocar</Text>
          </TouchableOpacity>

        </View>

      </Camera>

      <TouchableOpacity style={styles.botaoTirarFoto} onPress={takePicture}>
        <FontAwesome name="camera" size={23} color="#fff" />
      </TouchableOpacity>


      {pictureTaken &&
        <Modal animation="slide" transparent={false} visible={pictureModalOpen}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20 }}>
            <TouchableOpacity style={{ margin: 10 }} onPress={() => setPictureModalOpen(false)}>
              <FontAwesome name="window-close" size={50} color="#f00" />
            </TouchableOpacity>

            <Image
              style={{ width: '100%', height: 300, borderRadius: 20 }}
              source={{ uri: pictureTaken.uri }}
            />

          </View>

        </Modal>
      }

    </SafeAreaView>
  );
}

export default CameraScreen;