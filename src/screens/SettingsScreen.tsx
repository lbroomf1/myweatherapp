import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type SettingsStackParamList = {
  'Wi-Fi': undefined;
  'Bluetooth': undefined;
  'BarcodeScanner': undefined;
};

type Nav = NavigationProp<SettingsStackParamList>;

interface Props {
  navigation?: Nav;
}

const SettingsScreen: React.FC<Props> = (props) => {
  const navigation = props.navigation ?? useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Wi-Fi')}
      >
        <Text style={styles.buttonText}>Wi-Fi Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Bluetooth')}
      >
        <Text style={styles.buttonText}>Bluetooth Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BarcodeScanner')}
      >
        <Text style={styles.buttonText}>Barcode Scanner</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;
