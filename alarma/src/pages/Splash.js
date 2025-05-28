// src/pages/SplashScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkEntidad = async () => {
      const entidad = await AsyncStorage.getItem('entidad');
      if (entidad) {
        navigation.replace("Inicio");
      } else {
        navigation.replace("Setup");
      }
    };
    checkEntidad();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="blue" />
      <Text>Cargando configuración...</Text>
    </View>
  );
}
