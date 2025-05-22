import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

const BluetoothScreen = () => {
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [characteristics, setCharacteristics] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    return () => {
      manager.destroy();
    };
  }, [manager]);

  const startScan = () => {
    setScanning(true);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        return;
      }

      if (device) {
        setDevices((prevDevices) => {
          if (!prevDevices.find((d) => d.id === device.id)) {
            return [...prevDevices, device]; 
          }
          return prevDevices;
        });
      }
    });
  };

  const stopScan = () => {
    setScanning(false);
    manager.stopDeviceScan();
  };

  const connectToDevice = async (device: Device | null) => {
    if (!device) return;

    try {
      await device.connect();
      setConnectedDevice(device);
      const discovered = await device.discoverAllServicesAndCharacteristics();
      const deviceServices = await discovered.services();
      setServices(deviceServices);

      const defaultService = deviceServices[0]?.uuid;
      if (defaultService) {
        const deviceCharacteristics = await discovered.characteristicsForService(defaultService);
        setCharacteristics(deviceCharacteristics);
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const clearDevices = () => {
    setDevices([]); 
  };

  const renderDeviceItem = ({ item }: { item: Device }) => (
    <View style={styles.deviceItem}>
      <Text style={styles.deviceName}>{item.name || 'Unnamed Device'}</Text>
      <TouchableOpacity style={styles.connectButton} onPress={() => connectToDevice(item)}>
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderDeviceItem}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Bluetooth Devices</Text>
            <TouchableOpacity
              style={scanning ? styles.stopButton : styles.scanButton}
              onPress={scanning ? stopScan : startScan}
            >
              <Text style={styles.buttonText}>{scanning ? 'Stop Scanning' : 'Start Scanning'}</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          !scanning ? (
            <Text style={styles.emptyText}>No devices found. Tap "Start Scanning" to begin.</Text>
          ) : null
        }
        ListFooterComponent={
          connectedDevice ? (
            <View style={styles.connectedSection}>
              <Text style={styles.sectionTitle}>Connected to: {connectedDevice.name}</Text>
              <Text style={styles.subheading}>Services</Text>
              {services.map((service) => (
                <Text key={service.uuid} style={styles.infoItem}>{service.uuid}</Text>
              ))}
              <Text style={styles.subheading}>Characteristics</Text>
              {characteristics.map((char) => (
                <Text key={char.uuid} style={styles.infoItem}>{char.uuid}</Text>
              ))}
            </View>
          ) : null
        }
        contentContainerStyle={styles.deviceListContainer}
      />
      <TouchableOpacity style={styles.clearButton} onPress={clearDevices}>
        <Text style={styles.buttonText}>Clear Devices</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  scanButton: {
    backgroundColor: '#1E88E5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#D32F2F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FF5722',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  deviceListContainer: {
    paddingBottom: 100,
  },
  deviceItem: {
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  deviceName: {
    fontSize: 16,
    marginBottom: 8,
  },
  connectButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  connectedSection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
  },
  infoItem: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
});

export default BluetoothScreen;
