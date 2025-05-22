// src/types/react-native-wifi-reborn.d.ts
declare module 'react-native-wifi-reborn' {
  export interface WifiManager {
    loadWifiList(): Promise<{ SSID: string }[]>;
    connectToProtectedSSID(ssid: string, password: string, isHidden: boolean): Promise<void>;
  }

  export default WifiManager;
}
