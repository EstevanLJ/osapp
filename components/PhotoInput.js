import * as React from 'react';
import { View, Text, Button, StyleSheet, Image, Modal, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImageManipulator from 'expo-image-manipulator';

const styles = StyleSheet.create({

  photoInput: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    padding: 8,
    height: 150,
    borderColor: 'rgba(20,20,31,.12)',
    borderWidth: 1,
  },

  photoInputText: {
    fontSize: 16,
  },

  camera: {
    flex: 1
  },

  cameraContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between'
  },

  changeCameraButton: {
    position: 'absolute',
    bottom: 20,
    left: 20
  },

  changeCameraButtonText: {
    fontSize: 20,
    marginBottom: 13,
    color: '#fff'
  },

  takePhotoButton: {
    alignSelf: 'center',
    marginBottom: 35
  },

  confirmButton: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20
  }

})

function FormularioScreen(props) {

  const cameraRef = React.useRef();

  const [photoTaken, setPhotoTaken] = React.useState(null);
  const [photo, setPhoto] = React.useState(null);

  const [loading, setLoading] = React.useState(false);
  const [photoModal, setPhotoModal] = React.useState(false);
  const [confirmPhotoModal, setConfirmPhotoModal] = React.useState(false);
  const [cameraPermission, setCameraPermission] = React.useState(null);
  const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back);
  const [pictureSize, setPictureSize] = React.useState(null);


  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);

  React.useEffect(() => {
    if (props.value.value === null) {
      setPhoto(null);
    }
  }, [props.value]);


  React.useEffect(() => {
    if (cameraRef.current) {
      (async () => {
        let pictureSizes = await cameraRef.current.getAvailablePictureSizesAsync('4:3');
        setPictureSize(pictureSizes[Math.floor(pictureSizes.length/2)]);
      })();
    }
  }, [cameraRef.current]);

  async function takePicture() {
    setLoading(true);

    if (cameraRef) {
      let pictureSizes = await cameraRef.current.getAvailablePictureSizesAsync('4:3');
      setPictureSize(pictureSizes[Math.floor(pictureSizes.length/2)]);
      console.log(pictureSize)

      const picture = await cameraRef.current.takePictureAsync({ exif: true });

      setPhotoModal(false);

      const manipResult = await ImageManipulator.manipulateAsync(
        picture.uri,
        [{ rotate: -90 }],
        { compress: 0.5 }
      );

      setConfirmPhotoModal(true);
      setPhotoTaken(manipResult);
      setLoading(false);

    }
  }

  async function rotate(angle) {
    setLoading(true);

    if (cameraRef) {


      const manipResult = await ImageManipulator.manipulateAsync(
        photoTaken.uri,
        [{ rotate: angle }],
        {}
      );

      setConfirmPhotoModal(true);
      setPhotoTaken(manipResult);
      setLoading(false);

    }
  }

  const openPhotoModal = () => {
    setPhotoModal(true);
  }

  const acceptPhoto = async () => {

    setLoading(true);

    try {
      let location = await Location.getCurrentPositionAsync({});

      if (props.onChange) {
        props.onChange({
          ...photoTaken,
          location,
          descricao: props.label
        });
      }

      setPhoto(photoTaken);
      setPhotoTaken(null);

    } catch (error) {

      Alert.alert(
        'Atenção!',
        'Ocorreu um erro ao salvar a foto. Verifique as permissões de acesso à câmera e GPS.',
        [
          {
            text: 'Ver erro', onPress: () => {
              Alert.alert(
                'Erro',
                error.message,
                [
                  { text: 'Fechar' },
                ],
                { cancelable: false }
              );
            }
          },
          { text: 'OK' },
        ],
        { cancelable: false }
      );

    } finally {
      setLoading(false);
      setPhotoModal(false);
      setConfirmPhotoModal(false);
    }

  }

  const rejectPhoto = () => {
    setLoading(true);
    setPhotoTaken(null);
    setPhotoModal(true);
    setConfirmPhotoModal(false);
    setLoading(false);
  }

  return (
    <>
      <View style={styles.photoInput}>
        <Text style={styles.photoInputText}>{props.label}</Text>
        <View style={{ flex: 1, justifyContent: 'center' }}>

          {photo ? (
            <View style={{ justifyContent: 'flex-start', flexDirection: 'row', paddingVertical: 10 }}>
              <Image
                style={{ width: 120, height: 100, resizeMode: "contain", }}
                source={{ uri: photo.uri }}
              />
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                <Button title="Trocar Foto" onPress={() => openPhotoModal()} />
              </View>
            </View>
          ) : (
              <View style={{ justifyContent: 'flex-start', flexDirection: 'row', paddingVertical: 10 }}>
                <Text style={{}}>Nenhuma Foto</Text>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                  <Button style={{}} title="Tirar Foto" onPress={() => openPhotoModal()} />
                </View>
              </View>
            )}

        </View>
      </View>

      <Modal animation="slide" transparent={false} visible={photoModal}>
        <View style={{ flex: 1 }}>

          {cameraPermission &&
            <Camera
              style={styles.camera}
              type={cameraType}
              ref={cameraRef}
              pictureSize={pictureSize}
            >
              <View style={styles.cameraContainer}>

                <TouchableOpacity style={{ margin: 10, alignSelf: 'flex-end' }} onPress={() => setPhotoModal(false)}>
                  <FontAwesome name="times" size={30} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.changeCameraButton} onPress={() => {
                  setCameraType(
                    cameraType === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  )
                }}>
                  <FontAwesome style={styles.changeCameraButtonText} name="refresh" size={23} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.takePhotoButton} onPress={takePicture}>
                  <FontAwesome name="camera" size={30} color="#fff" />
                </TouchableOpacity>

              </View>

            </Camera>
          }

        </View>
      </Modal>


      <Modal animation="slide" transparent={true} visible={confirmPhotoModal}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>

          <View style={{ height: 100, flexDirection: 'row', justifyContent: 'center' }}>
            <View style={styles.confirmButton}>
              <TouchableOpacity onPress={() => rotate(-90)}>
                <FontAwesome name="rotate-left" size={30} color="#ddd" />
              </TouchableOpacity>
            </View>

            <View style={styles.confirmButton}>
              <TouchableOpacity onPress={() => rotate(90)}>
                <FontAwesome name="rotate-right" size={30} color="#ddd" />
              </TouchableOpacity>
            </View>
          </View>

          {photoTaken &&
            <Image
              style={{ width: '100%', height: 300 }}
              source={{ uri: photoTaken.uri }}
            />
          }

          <View style={{ height: 100, flexDirection: 'row', justifyContent: 'center' }}>
            <View style={styles.confirmButton}>
              <TouchableOpacity onPress={() => acceptPhoto()}>
                <FontAwesome name="check" size={50} color="#38c172" />
              </TouchableOpacity>
            </View>

            <View style={styles.confirmButton}>
              <TouchableOpacity onPress={() => rejectPhoto()}>
                <FontAwesome name="times" size={50} color="#e3342f" />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </Modal>

      <Modal animation="slide" transparent={true} visible={loading}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <ActivityIndicator size="large" />
          <Text style={{ color: '#fff' }}>Carregando</Text>
        </View>
      </Modal>

    </>
  );
}

export default FormularioScreen;