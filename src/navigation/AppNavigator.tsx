import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import LaunchScreen from '../screens/LaunchScreen';
import WeatherScreen from '../screens/WeatherScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WifiScreen from '../screens/WifiScreen';
import BluetoothScreen from '../screens/BluetoothScreen';
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen';

import LoadingScreen from '../screens/LoadingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const SettingsStack = createStackNavigator();

const SettingsStackScreen = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen
      name="SettingsMain"
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
    <SettingsStack.Screen name="Wi-Fi" component={WifiScreen} />
    <SettingsStack.Screen name="Bluetooth" component={BluetoothScreen} />
    <SettingsStack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
  </SettingsStack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Launch" component={LaunchScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3500); 
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#222',
              paddingBottom: 6,
              paddingTop: 6,
              height: 70,
              borderTopWidth: 0,
              elevation: 5,
            },
            tabBarActiveTintColor: '#00C853',
            tabBarInactiveTintColor: '#aaa',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
              paddingBottom: 5,
            },
            tabBarIcon: ({ color, size }) => {
              let iconName = 'apps';

              switch (route.name) {
                case 'Home':
                  iconName = 'home';
                  break;
                case 'Weather':
                  iconName = 'weather-partly-cloudy';
                  break;
                case 'Settings':
                  iconName = 'cog';
                  break;
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Home" component={MainStack} options={{ tabBarLabel: 'Home' }} />
          <Tab.Screen name="Weather" component={WeatherScreen} options={{ tabBarLabel: 'Weather' }} />
          <Tab.Screen name="Settings" component={SettingsStackScreen} options={{ tabBarLabel: 'Settings' }} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
