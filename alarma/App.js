import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PageNavigation } from './src/navigation/PageNavigation';
import React, { useEffect, useState } from "react";
import UserState from './src/context/UserState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './src/auth/firebase_config';

export default function App() {

  const app=initializeApp(firebaseConfig);


  const idcw = "c7af5d528da560b5eb67933e07b8f35558C42593633F11DE5E63FA5AB712B6F48B0BD460";

  const [sessionId, setSessionId] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true); // <-- Agregamos estado de loading
const [entidad,setEntidad]=useState("");

  useEffect(() => {
    const getUserData = async () => {
    
      const storedEntidad = await AsyncStorage.getItem('entidad');
     
      setEntidad(storedEntidad);
    };
    getUserData();
  }, []);


  // Hacemos login
  useEffect(() => {
    const login = async () => {
      try {
        const response = await fetch('https://hst-api.wialon.com/wialon/ajax.html', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            svc: 'token/login',
            params: JSON.stringify({ token: idcw })
          }).toString()
        });
        const data = await response.json();
        setSessionId(data.eid);
      } catch (error) {
        console.error('Error en login:', error);
      }
    };

    login();
  }, []);

  const getUnits = async (unitId) => {
    const paramsUnit = {
      spec: {
        itemsType: "avl_unit",
        propName: "sys_id",
        propValueMask: unitId,
        sortType: "sys_name",
      },
      force: 1,
      flags: 6817569,
      from: 0,
      to: 0
    };

    try {
      const response = await fetch('https://hst-api.wialon.com/wialon/ajax.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          svc: 'core/search_items',
          params: JSON.stringify(paramsUnit),
          sid: sessionId
        }).toString()
      });

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const unidad = data.items[0];
        setUnidades(prev => [...prev, unidad]);
      }
    } catch (error) {
      console.error('Error en getUnits:', error);
    }
  };

  // Cargamos grupos después del login
  useEffect(() => {
    if (!sessionId) return;

    const getGroups = async () => {
      try {
        const paramsGroup = {
          spec: {
            itemsType: "avl_unit_group",
            propName: "rel_user_creator_name",
            propValueMask: entidad,
            sortType: "sys_name"
          },
          force: 1,
          flags: 9217,
          from: 0,
          to: 0
        };

        const response = await fetch('https://hst-api.wialon.com/wialon/ajax.html', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            svc: 'core/search_items',
            params: JSON.stringify(paramsGroup),
            sid: sessionId
          }).toString()
        });

        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const grupo = data.items[0];
          const unitsId = grupo.u;

          // Buscamos todas las unidades
          await Promise.all(unitsId.map(id => getUnits(id)));
          
          setLoading(false); // <-- ¡Ya terminó de cargar todo!
        } else {
          console.error('No se encontraron grupos.');
          setLoading(false);
        }

      } catch (error) {
        console.error('Error en getGroups:', error);
        setLoading(false);
      }
    };

    getGroups();
  }, [sessionId, entidad]);

  // Si todavía está cargando
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Buscando estación...</Text>
      </View>
    );
  }

  // Cuando ya todo está OK
  return (
    <UserState unidades={unidades} sessionId={sessionId}  app={app}>
      <NavigationContainer>
        <PageNavigation />
      </NavigationContainer>
    </UserState>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    alignItems: 'center',
    justifyContent: 'center',
  },
});