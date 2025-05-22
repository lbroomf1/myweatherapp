import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoadingScreen = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const thunderboltPosition = new Animated.Value(0);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 3000);

    Animated.loop(
      Animated.sequence([
        Animated.timing(thunderboltPosition, {
          toValue: 20,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(thunderboltPosition, {
          toValue: 0,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (isLoaded) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <View style={styles.cloud}>
        <Icon name="weather-lightning-rainy" size={100} color="blue" />
        <Animated.View
          style={[styles.thunderbolt, { transform: [{ translateY: thunderboltPosition }] }]}
        >
          <Icon name="weather-lightning" size={50} color="yellow" />
        </Animated.View>
      </View>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  cloud: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  thunderbolt: {
    position: 'absolute',
    top: 20,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default LoadingScreen;
