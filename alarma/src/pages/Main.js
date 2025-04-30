import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  ImageBackground,
} from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../context/UserContext";
import Logo from "../assets/background.png";

/**importamos las librerias para manejar la base de datos */
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../auth/firebase_config";
import { getDatabase, ref, push } from "firebase/database";

export default function Main(props) {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const { unidades, sessionId } = useContext(UserContext);
  const [phone, setPhone] = useState("");

  // console.log("Unidades desde Main:", unidades);
  // Crea una referencia a la colección 'eventos'

  const eventosRef = ref(db, "eventos");

  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [user, setUser] = useState("");
  const [alarmStation, setAlarmStation] = useState("");
  const [entidad, setEntidad] = useState("");
  const [alarma, setAlarma] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      const storedPhone = await AsyncStorage.getItem("phone");
      const storedEmail = await AsyncStorage.getItem("email");
      const storedUser = await AsyncStorage.getItem("user");
      const storedAlarm = await AsyncStorage.getItem("alarmStation");
      const storedEntidad = await AsyncStorage.getItem("entidad");
      setPhoneNumber(storedPhone);
      setEmail(storedEmail);
      setUser(storedUser);
      setAlarmStation(storedAlarm);
      setEntidad(storedEntidad);
    };
    getUserData();
  }, []);
  useEffect(() => {
    unidades.forEach((unidad) => {
      if (unidad.nm === alarmStation) {
        setAlarma(unidad);
        setPhone(unidad.ph);
      }
    });
  }, [unidades, alarmStation]);
  const saveAlarm = (evento, motivo) => {
    // Crea un nuevo evento con ID automático
    push(eventosRef, {
      evento: evento,
      estacion: alarmStation,
      motivo: motivo,
      atendido: false,
      fecha: new Date().toLocaleString(),
      usuario: user,
      telefono: phoneNumber,
      email: email,
    });
  };

  /**
   * Ejecutar un comando en la unidad seleccionada
   */
  const sendCommand = async (
    unidadId,
    commandName,
    commandParams,
    evento,
    motivo
  ) => {
    const params = {
      itemId: unidadId, // id de la unidad
      commandName: commandName, // nombre del comando creado en Wialon
      param: commandParams, // parámetros que quieras pasarle
      linkType: "", // normalmente 1 para TCP
      timeout: 0,
      flags: 0,
    };

    try {
      const response = await fetch(
        "https://hst-api.wialon.com/wialon/ajax.html",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            svc: "unit/exec_cmd",
            params: JSON.stringify(params),
            sid: sessionId,
          }).toString(),
        }
      );

      const data = await response.json();

      if (data.error) {
        console.error("Error enviando comando:", data.error);
        Alert.alert(
          "Error",
          `Error al enviar el comando, intentelo nuevamente`,
          [{ text: "OK" }],
          { cancelable: true }
        );
        return null;
      } else {
        console.log("Respuesta del comando:", data);
        saveAlarm(evento, motivo);
      }

      return data;
    } catch (error) {
      console.error("Error en unit/exec_cmd:", error);
      return null;
    }
  };

/**
 * Mostrar un alert con opciones para seleccionar el tipo de alarma
 */
const mostrarAlertaConOpciones = (accion) => {
  Alert.alert(
    "Tipo de Alarma",
    "Seleccione el tipo de alarma",
    [
      {
        text: "Por robo",
        onPress: () =>{ 
          switch (accion) {
            case "activar alarma":
              sendCommand(
                alarma.id,
                alarma.cmds[0].n,
                alarma.cmds[0].p,
                "Alarma activada",
                "Por robo"
              );
              break;
            case "desactivar alarma":
              sendCommand(
                alarma.id,
                alarma.cmds[1].n,
                alarma.cmds[1].p,
                "Alarma desactivada",
                "Por robo"
              );
              break;
              case "activar perifoneo":
                sendCommand(alarma.id, alarma.cmds[2].n, alarma.cmds[2].p, "Perifoneo activado","Por robo");
               
                break;
              case "desactivar perifoneo":
                sendCommand(alarma.id, alarma.cmds[3].n, alarma.cmds[3].p, "Perifoneo desactivado","Por robo");
               
                break;
            default:
              break;
          }

        
        },
        style: "cancel",
      },
      {
        text: "Por incendio",
        onPress: () =>{ 
          switch (accion) {
            case "activar alarma":
              sendCommand(
                alarma.id,
                alarma.cmds[0].n,
                alarma.cmds[0].p,
                "Alarma activada",
                "Por incendio"
              );
              break;
            case "desactivar alarma":
              sendCommand(
                alarma.id,
                alarma.cmds[1].n,
                alarma.cmds[1].p,
                "Alarma desactivada",
                "Por incendio"
              );
              break;
              case "activar perifoneo":
                sendCommand(alarma.id, alarma.cmds[2].n, alarma.cmds[2].p, "Perifoneo activado","Por incendio");
               
                break;
              case "desactivar perifoneo":
                sendCommand(alarma.id, alarma.cmds[3].n, alarma.cmds[3].p, "Perifoneo desactivado","Por incendio");
               
                break;
            default:
              break;
          }

        
        },
      },
      {
        text: "Prueba",
        onPress: () =>{ 
          switch (accion) {
            case "activar alarma":
              sendCommand(
                alarma.id,
                alarma.cmds[0].n,
                alarma.cmds[0].p,
                "Alarma activada",
                "Prueba"
              );
              break;
            case "desactivar alarma":
              sendCommand(
                alarma.id,
                alarma.cmds[1].n,
                alarma.cmds[1].p,
                "Alarma desactivada",
                "Prueba"
              );
              break;
              case "activar perifoneo":
                sendCommand(alarma.id, alarma.cmds[2].n, alarma.cmds[2].p, "Perifoneo activado","Prueba");
               
                break;
              case "desactivar perifoneo":
                sendCommand(alarma.id, alarma.cmds[3].n, alarma.cmds[3].p, "Perifoneo desactivado","Prueba");
               
                break;
            default:
              break;
          }

        
        }
      },
    ],
    { cancelable: true }
  );
};

  return (
    <ImageBackground
      source={Logo} // <-- tu imagen aquí
      resizeMode="cover"
      style={styles.Imagebackground}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(255,255,255,0.4)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/**
    View que contiene todos los botones de la alarma y el perifoneo
     */}
        <View
          style={{
            padding: 30,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 50,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/**
    View que contiene los botones de la alarma
     */}
          <View>
            <Text style={{ color: "white", fontSize: 14, marginBottom: 20 }}>
              Alarma {alarmStation}
            </Text>
          </View>
          <View style={styles.row2col}>
            <TouchableOpacity
              style={[styles.btnFlash, { backgroundColor: "orange" }]}
              onPress={() => {
                mostrarAlertaConOpciones("activar alarma");
              }}
            >
              <MaterialCommunityIcons
                name="alarm-light"
                size={32}
                color="white"
              />

              <Text style={{ color: "white" }}>Activar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnFlash, { backgroundColor: "rgb(15,125,125)" }]}
              onPress={() => {
                mostrarAlertaConOpciones("desactivar alarma");
           
              }}
            >
              <MaterialCommunityIcons
                name="alarm-light-off"
                size={32}
                color="white"
              />
              <Text style={{ color: "white" }}>Desactivar</Text>
            </TouchableOpacity>
          </View>

          {/**
      View que contiene los botones del perifoneo
       */}
          <View>
            <Text style={{ color: "white", fontSize: 14, marginBottom: 20 }}>
              Perifoneo
            </Text>
          </View>
          <View style={styles.row2col}>
            <TouchableOpacity
              style={[styles.btnFlash, { backgroundColor: "green" }]}
              onPress={() => {
                mostrarAlertaConOpciones("activar perifoneo");
              
                
                //console.log("telefono",phone)
                if (phone) {
                  Linking.openURL(`tel:${phone}`);
                } else {
                  Alert.alert(
                    "Error",
                    "No hay un número de teléfono disponible."
                  );
                }
              }}
            >
              <FontAwesome name="microphone" size={32} color="white" />
              <Text style={{ color: "white" }}>Activar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnFlash, { backgroundColor: "red" }]}
              onPress={() => {
                mostrarAlertaConOpciones("desactivar perifoneo");
              
               
              }}
            >
              <FontAwesome name="microphone-slash" size={32} color="white" />
              <Text style={{ color: "white" }}>Desactivar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  buttonLabel: {
    color: "#000",
    fontSize: 16,
  },
  btnFlash: {
    width: 82,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    bottom: 10,
    borderColor: "rgba(120, 120, 120, 0.5)",
    borderWidth: 1.5,
    // Sombra en iOS
    shadowColor: "#fff",
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    // Sombra en Android
    elevation: 15,
  },
  row2col: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },
  Imagebackground: {
    width: "100%",
    height: "100%",
  },
});
