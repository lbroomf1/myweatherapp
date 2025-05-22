import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = '67dc402852de39fdfc137f29b6edfe18';
const API_URL = 'https://api.openweathermap.org/data/2.5/';

const WeatherScreen = () => {
  const [zipCode, setZipCode] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ zip: string; temp: number }[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const historyData = await AsyncStorage.getItem('weatherHistory');
        if (historyData) setHistory(JSON.parse(historyData));
      } catch (err) {
        console.error('Error loading weather history:', err);
      }
    };

    loadHistory();
  }, []);

  const fetchWeather = async (zipOverride?: string) => {
  const zipToUse = zipOverride || zipCode;

  if (!/^\d{5}$/.test(zipToUse)) {
    setError('Please enter a valid 5-digit ZIP code.');
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const weatherRes = await axios.get(
      `${API_URL}weather?zip=${zipToUse},us&appid=${API_KEY}&units=imperial`
    );

    if (!weatherRes?.data || weatherRes.data.cod === '404') {
      throw new Error('ZIP code not found.');
    }

    setWeatherData(weatherRes.data);

    const forecastRes = await axios.get(
      `${API_URL}forecast?zip=${zipToUse},us&appid=${API_KEY}&units=imperial`
    );
    const daily = forecastRes.data.list.filter((item: any) =>
      item.dt_txt.includes('15:00:00')
    );
    setForecast(daily);

    const newEntry = { zip: zipToUse, temp: weatherRes.data.main.temp };
    const isDuplicate = history.some(entry => entry.zip === zipToUse);
    const updatedHistory = isDuplicate
      ? history
      : [newEntry, ...history].slice(0, 5);

    setHistory(updatedHistory);
    await AsyncStorage.setItem('weatherHistory', JSON.stringify(updatedHistory));

    if (!zipOverride) setZipCode('');
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      setError('ZIP code not found. Please try another.');
    } else {
      setError('Failed to fetch weather data. Please try again.');
    }
    console.error('Weather fetch error:', err);
  } finally {
    setLoading(false);
  }
};


  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('weatherHistory');
      setHistory([]);
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  const getLocation = () => {
    if (weatherData) {
      const city = weatherData.name;
      const country = weatherData.sys?.country || 'US';
      let state = 'Unknown';

      if (city === 'Atlanta') state = 'GA';

      return `${city}, ${state}, ${country}`;
    }
    return '';
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Weather Forecast</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter ZIP Code"
          value={zipCode}
          onChangeText={setZipCode}
          keyboardType="numeric"
        />
        <Button title="Search" onPress={() => fetchWeather()} disabled={loading} />

        <View style={styles.clearBtn}>
          <Button title="Clear History" color="#d32f2f" onPress={clearHistory} />
        </View>

        {loading && <ActivityIndicator size="large" color="#1E88E5" style={{ marginTop: 20 }} />}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {weatherData && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Current Weather</Text>
            <Text style={styles.location}>{getLocation()}</Text>
            <Text style={styles.mainTemp}>{weatherData.main.temp}°F</Text>
            <Text style={styles.description}>{weatherData.weather[0].description}</Text>
          </View>
        )}

        {forecast.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>5-Day Forecast</Text>
            {forecast.map((item) => (
              <View key={item.dt} style={styles.forecastItem}>
                <Text style={styles.forecastDate}>
                  {new Date(item.dt * 1000).toLocaleDateString()}
                </Text>
                <Text>{item.main.temp}°F - {item.weather[0].description}</Text>
              </View>
            ))}
          </View>
        )}

        {history.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.cardTitle}>Weather History</Text>
            <FlatList
              data={history}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.zip}
              contentContainerStyle={{ paddingVertical: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => fetchWeather(item.zip)}>
                  <View style={styles.historyItem}>
                    <Text style={styles.historyText}>ZIP: {item.zip}</Text>
                    <Text style={styles.historyText}>Temp: {item.temp}°F</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#E3F2FD',
  },
  title: {
    padding: 30,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D47A1',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  clearBtn: {
    marginTop: 8,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1E88E5',
  },
  location: {
    fontSize: 18,
    fontWeight: '600',
    color: '#616161',
    marginBottom: 10,
  },
  mainTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF7043',
  },
  description: {
    fontSize: 16,
    color: '#616161',
  },
  forecastItem: {
    marginBottom: 10,
  },
  forecastDate: {
    fontWeight: '600',
    color: '#333',
  },
  historyContainer: {
    marginBottom: 40,
  },
  historyItem: {
    backgroundColor: '#BBDEFB',
    padding: 12,
    borderRadius: 10,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
  },
  historyText: {
    fontSize: 14,
    color: '#0D47A1',
    fontWeight: '500',
  },
});

export default WeatherScreen;
