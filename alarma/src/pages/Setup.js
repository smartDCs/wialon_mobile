import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase, onValue, set, ref as RefDb } from "firebase/database";
import { UserContext } from "../context/UserContext";

export default function InitialSetup({ navigation }) {
const {db}=useContext(UserContext);

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [alarmStation, setAlarmStation] = useState("");
  const [entidad, setEntidad] = useState("");
const [enabled,setEnabled]=useState(false);
  useEffect(() => {
    const getUserData = async () => {
      const storedPhone = await AsyncStorage.getItem("phone");
      const storedEmail = await AsyncStorage.getItem("email");
      const storedUser = await AsyncStorage.getItem("user");
      const storedAlarm = await AsyncStorage.getItem("alarmStation");
      const storedEntidad = await AsyncStorage.getItem("entidad");
      const storedEnabled=await AsyncStorage.getItem("enabled");
      setPhone(storedPhone);
      setEmail(storedEmail);
      setUser(storedUser);
      setAlarmStation(storedAlarm);
      setEntidad(storedEntidad);
      setEnabled(storedEnabled);
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
      await AsyncStorage.setItem("enabled","false");

set(RefDb(db,`abonados/${phone}`),{
  user:user,
  email:email,
  phone:phone,
  entidad:entidad,
  alarmStation:alarmStation,
  enabled:false,
  createdAt: new Date().toISOString(),
})

      navigation.navigate("Main");
    } catch (error) {
      console.error("Error guardando datos iniciales", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.fondo}>
          <View style={styles.titulo}>
            <Text style={styles.title}>Configuración Inicial</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Número de teléfono"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            keyboardType="ascii-capable"
            value={user}
            onChangeText={setUser}
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.input}
            placeholder="Entidad"
            keyboardType="ascii-capable"
            value={entidad}
            onChangeText={setEntidad}
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.input}
            placeholder="Estación de alarma"
            keyboardType="ascii-capable"
            value={alarmStation}
            onChangeText={setAlarmStation}
            placeholderTextColor="#ccc"
          />
          <Button title="Guardar" onPress={handleSave} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fondo: {
    backgroundColor: "rgba(250, 250, 250, 0.9)",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    borderBottomWidth:2,
    borderRightWidth:2,
    borderColor:"rgb(120,120,120)"
  },
  titulo: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "rgb(120,120,120)",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: "#000",
  },
});
