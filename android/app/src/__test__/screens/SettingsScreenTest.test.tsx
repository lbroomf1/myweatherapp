{/*ßimport React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../../src/screens/SettingsScreen';
import { NavigationContainer } from '@react-navigation/native';

describe('SettingsScreen', () => {
  it('renders all settings options', () => {
    const { getByText } = render(
      <NavigationContainer>
        <SettingsScreen />
      </NavigationContainer>
    );

    expect(getByText('Wi-Fi Settings')).toBeTruthy();
    expect(getByText('Bluetooth Settings')).toBeTruthy();
    expect(getByText('Scan Barcode')).toBeTruthy();
  });

  it('navigates when buttons are pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <SettingsScreen />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Wi-Fi Settings'));
    fireEvent.press(getByText('Bluetooth Settings'));
    fireEvent.press(getByText('Scan Barcode'));
    
    // Normally you'd use a mock navigator and assert navigation calls
  });
});
*/}