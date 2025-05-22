# Weather and Device Connectivity App (React Native with TypeScript)

This React Native app uses **TypeScript** and provides several functionalities for interacting with weather data, Bluetooth devices, Wi-Fi networks, and barcode scanning. The app leverages various libraries like `react-native-ble-plx` for Bluetooth connectivity, `react-native-camera-kit` for barcode scanning, and integrates a free weather API for weather data.

## Features

### 1. **Weather Page**
   - **Current Weather & 3–5 Day Forecast**: Displays the current weather and a 3–5 day weather forecast using a free weather API.
   - **Search by U.S. ZIP Code**: Users can search weather data for different locations by entering a ZIP code.
   - **Weather History**: Shows the last 5 ZIP codes searched, along with the current temperature for each.

### 2. **Bluetooth Page**
   - **Bluetooth Scanning**: Enables scanning for nearby Bluetooth devices.
   - **Device Connection**: Allows users to connect to a Bluetooth device.
   - **View Services & Characteristics**: Displays available services and characteristics of the connected Bluetooth device.
   - (Optional) **Library**: Uses `react-native-ble-plx` to handle Bluetooth functionality, though another library can be used if desired.

### 3. **Wi-Fi Page**
   - **Wi-Fi Networks**: Lists nearby Wi-Fi networks.
   - **Network Details**: Displays network details after successfully connecting to a Wi-Fi network.

### 4. **Barcode Scanner Page**
   - **Scan Barcodes**: Implements a barcode scanner component to scan different barcodes.
   - **Scan History**: Lists the last 5 barcodes scanned.
   - (Optional) **Library**: Uses `react-native-camera-kit` for barcode scanning, though other open-source libraries can be used as alternatives.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lbroomf1/myweatherapp.git
   cd myweatherapp
