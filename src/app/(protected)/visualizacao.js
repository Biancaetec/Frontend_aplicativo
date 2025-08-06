import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Visualização() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Visualização</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",  
    alignItems: "center",      
    backgroundColor: "#fff",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitulo: {
    fontSize: 16,
    color: "#555",
  },
});
