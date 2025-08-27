import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MesaContext } from "../../MesaContext"; // ajuste o caminho se necessário

export default function Visualizacao() {
  const { mesas } = useContext(MesaContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.mesasContainer}>
        {mesas.map((mesa, index) => (
          <View key={index} style={styles.mesaBox}>
            <Text style={styles.mesaTexto}>{mesa.numero}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  
  mesasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  mesaBox: {
    width: "28%",
    aspectRatio: 1,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "green",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  mesaTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D3A87",
  },
});
