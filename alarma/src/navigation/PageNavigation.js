import React, { useEffect, useState } from 'react';
import {
    DrawerContentScrollView,
    createDrawerNavigator,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 

import MenuButonItem from "../components/MenuButonItem";
import { StyleSheet, Text, View } from 'react-native';

import Main from '../pages/Main';


import InitialSetup from '../pages/Setup'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <MenuItems {...props} />}>
      <Drawer.Screen name="Main" component={Main} />
  
      <Drawer.Screen name="Setup" component={InitialSetup} />
    </Drawer.Navigator>
  );
}

export function PageNavigation() {
  const [isReady, setIsReady] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const launched = await AsyncStorage.getItem('hasLaunched');
      setHasLaunched(launched === 'true');
      setIsReady(true);
    };
    checkFirstLaunch();
  }, []);

  if (!isReady) {
    return null; // Mientras carga AsyncStorage no mostrar nada
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasLaunched ? (
        <Stack.Screen name="InitialSetup" component={InitialSetup} />
      ) : (
        <Stack.Screen name="Inicio" component={DrawerNavigator} />
      )}
    </Stack.Navigator>
  );
}

const MenuItems = ({ navigation }) => {
  return (
    <DrawerContentScrollView style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <MenuButonItem
        text={"Inicio"}
        onPress={() => {
          navigation.navigate("Inicio");
        }}
      />
      <MenuButonItem
        text="Setup"
        onPress={() => {
          navigation.navigate("Setup");
        }}
      />
     
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "rgba(4,4,4,0.8)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
});
