import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Categoriacadastrar() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>trocar para o conteudo</Text>

    </View>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  texto: {
    fontSize: 18,
    color: "#333",
  },
});
