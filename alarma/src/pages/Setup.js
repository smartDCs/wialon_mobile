import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function InitialSetup({ navigation }) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [alarmStation, setAlarmStation] = useState("");
  const [entidad,setEntidad]=useState("");
 useEffect(() => {
    const getUserData = async () => {
      const storedPhone = await AsyncStorage.getItem('phone');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedUser = await AsyncStorage.getItem('user');
      const storedAlarm = await AsyncStorage.getItem('alarmStation');
      const storedEntidad = await AsyncStorage.getItem('entidad');
      setPhone(storedPhone);
      setEmail(storedEmail);
      setUser(storedUser);
      setAlarmStation(storedAlarm);
      setEntidad(storedEntidad);
    };
    getUserData();
  }, []);
  const handleSave = async () => {
    try {
      await AsyncStorage.setItem("phone", phone);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("user", user);
      await AsyncStorage.setItem("alarmStation", alarmStation);
      await AsyncStorage.setItem("entidad", entidad);
      await AsyncStorage.setItem("hasLaunched", "true");
      navigation.navigate("Inicio"); // Ir directamente a Login después
    } catch (error) {
      console.error("Error guardando datos iniciales", error);
    }
  };

  return ( 
    <View style={styles.container}>
      <Text style={styles.title}>Configuración Inicial</Text>
      <TextInput
        style={styles.input}
        placeholder="Número de teléfono"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        keyboardType="ascii-capable"
        value={user}
        onChangeText={setUser}
      />
        <TextInput
        style={styles.input}
        placeholder="Entidad"
        keyboardType="ascii-capable"
        value={entidad}
        onChangeText={setEntidad}
      />
       <TextInput
        style={styles.input}
        placeholder="Estación de alarma"
        keyboardType="ascii-capable"
        value={alarmStation}
        onChangeText={setAlarmStation}
      />
      <Button title="Guardar" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
