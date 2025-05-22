import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  Text,
  FlatList,
} from 'react-native';
import { Camera, CameraType, CameraApi } from 'react-native-camera-kit';

interface ScannedBarcode {
  value: string;
  type: string;
}

const BarcodeScanner: React.FC = () => {
  const cameraRef = useRef<CameraApi | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScannedBarcode[]>([]);

  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera access to scan barcodes.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    requestCameraPermission().then((granted) => {
      setHasCameraPermission(granted);
      if (!granted) {
        Alert.alert('Permission Denied', 'Cannot scan without camera access.');
      }
    });
  }, []);

  const onBarcodeScan = (event: any) => {
    const { codeStringValue, codeType } = event.nativeEvent;
    if (codeStringValue) {
      const newEntry = { value: codeStringValue, type: codeType };
      setScanHistory((prev) => {
        const updated = [newEntry, ...prev.filter((item) => item.value !== codeStringValue)];
        return updated.slice(0, 5);
      });
    }
  };

  return (
    <View style={styles.container}>
      {hasCameraPermission ? (
        <>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            cameraType={CameraType.Back}
            scanBarcode={true}
            onReadCode={onBarcodeScan}
            showFrame={true}
            laserColor="blue"
            frameColor="yellow"
          />

          <View style={styles.historyContainer}>
            <Text style={styles.title}>Scan History</Text>
            <FlatList
              data={scanHistory}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              renderItem={({ item }) => (
                <Text style={styles.historyItem}>
                  {item.value} ({item.type})
                </Text>
              )}
            />
          </View>
        </>
      ) : (
        <Text style={styles.text}>Camera permission not granted</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 3,
    width: '100%',
  },
  historyContainer: {
    flex: 2,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  historyItem: {
    fontSize: 16,
    paddingVertical: 4,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BarcodeScanner;
