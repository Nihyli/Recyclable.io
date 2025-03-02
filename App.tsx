// app.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import {CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';


// If you plan to load a bundled model, you can use bundleResourceIO from tfjs-react-native
// import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/rVWTvKLNQ/model.json';

const App: React.FC = () => {
  // Get permission status and request function from the hook.
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [facing, setFacing] = useState<CameraType>('back');
  // Create a ref for the Camera component.
  const cameraRef = useRef<CameraView>(null);

  // Update hasPermission state when permission data changes.
  useEffect(() => {
    if (permission) {
      setHasPermission(permission.granted);
      if (!permission.granted) {
        requestPermission();
      }
    }
  }, [permission, requestPermission]);

  // Initialize TensorFlow.js and load the Teachable Machine model.
  useEffect(() => {
    (async () => {
      await tf.ready();
      try {
        const loadedModel = await tf.loadGraphModel(MODEL_URL);
        setModel(loadedModel);
        Alert.alert('Model loaded!', 'The model has been loaded successfully.');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        Alert.alert('Error loading model', errorMessage);
      }
    })();
  }, []);

  // Function to run prediction.
  const runPrediction = async () => {
    if (!model) {
      Alert.alert('Model not loaded', 'Please wait for the model to load.');
      return;
    }
    if (!cameraRef.current) {
      Alert.alert('Camera error', 'Camera is not available.');
      return;
    }
    // Capture an image from the camera.
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: true });
    // TODO: Convert photo.uri to a tensor and run inference with model.predict().
    // For now, we simulate the prediction.
    setPrediction('Recyclable: 0.92');
  };

  // Render appropriate UI based on camera permission status.
  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Requesting Camera Permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Render the Camera component and pass the ref */}
      <CameraView style={styles.camera} ref={cameraRef} facing={facing}/>
      <View style={styles.buttonContainer}>
        <Button title="Run Prediction" onPress={runPrediction} />
      </View>
      {prediction !== '' && (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionText}>{prediction}</Text>
        </View>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  predictionContainer: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 5,
  },
  predictionText: {
    color: '#fff',
    fontSize: 18,
  },
});
