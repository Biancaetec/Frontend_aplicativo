import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MesaContext } from "../../MesaContext";
import { CategoriaContext } from "../../CategoriaContext";
import { useRouter } from "expo-router";

export default function Visualizacao() {
  const { mesas } = useContext(MesaContext);
  const { categorias } = useContext(CategoriaContext);
  const router = useRouter();

  const abrirCategorias = () => {
    // Navega para a tela de visualização das categorias
    router.push("/(protected)/categorias");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.mesasContainer}>
        {mesas.map((mesa, index) => (
          <TouchableOpacity
            key={index}
            style={styles.mesaBox}
            onPress={abrirCategorias}
          >
            <Text style={styles.mesaTexto}>{mesa.numero}</Text>
          </TouchableOpacity>
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
    height: 90,
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
