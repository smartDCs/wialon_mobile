import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const MenuButonItem = ({text,onPress}) => {
  return (
    <TouchableOpacity
    onPress={onPress}
    style={styles.Butoncontainer}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles=StyleSheet.create({
  Butoncontainer:{
    marginBottom:15,
    padding:15,
   // backgroundColor:'#345643',
  }  ,
  text:{
    color:"white",
    fontSize:20,
  }

})

export default MenuButonItem