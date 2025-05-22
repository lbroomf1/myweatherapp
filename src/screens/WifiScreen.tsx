import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';

const WifiScreen = () => {
  const [wifiList, setWifiList] = useState<{ SSID: string; level: number }[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadWifi();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location permission required',
          message: 'We need location access to scan for Wi-Fi networks',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const loadWifi = async () => {
    setError('');
    setIsLoading(true);

    if (Platform.OS === 'ios') {
      setError('Wi-Fi scanning is not supported on iOS due to Apple restrictions.');
      setIsLoading(false);
      return;
    }

    const permission = await requestPermissions();
    if (!permission) {
      setError('Permission denied');
      setIsLoading(false);
      return;
    }

    try {
      const isEnabled = await WifiManager.isEnabled();
      if (!isEnabled) {
        setError('Wi-Fi is disabled. Please enable it.');
        setIsLoading(false);
        return;
      }

      const networks = await WifiManager.reScanAndLoadWifiList();
      setWifiList(networks.map(({ SSID, level }) => ({ SSID, level })));
      setIsLoading(false);
    } catch (e) {
      if (e instanceof Error) {
        setError('Failed to load Wi-Fi list: ' + e.message);
      } else {
        setError('Failed to load Wi-Fi list: Unknown error');
      }
      setIsLoading(false);
    }
  };

  const getSignalQuality = (level: number) => {
    if (level >= -50) return 'Excellent';
    if (level >= -60) return 'Good';
    if (level >= -70) return 'Fair';
    return 'Weak';
  };

  const renderNetwork = ({ item }: { item: { SSID: string; level: number } }) => (
    <View style={styles.networkItem}>
      <Text style={styles.networkText}>{item.SSID}</Text>
      <Text style={styles.signalText}>Signal: {getSignalQuality(item.level)} ({item.level} dBm)</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Wi-Fi Networks</Text>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : wifiList.length === 0 ? (
        <Text style={styles.noNetworksText}>No Wi-Fi networks found. Try scanning again.</Text>
      ) : (
        <FlatList
          data={wifiList}
          keyExtractor={(item) => item.SSID}
          renderItem={renderNetwork}
        />
      )}

      <Button title="Scan Again" onPress={loadWifi} disabled={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  networkItem: {
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
  networkText: { fontSize: 16, fontWeight: '500' },
  signalText: { fontSize: 14, color: '#555' },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  noNetworksText: { color: '#555', marginTop: 10, textAlign: 'center' },
});

export default WifiScreen;
