import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MesaContext } from "../../MesaContext";
import { useRouter } from "expo-router";

export default function Visualizacao() {
  const { mesas, selecionarMesa } = useContext(MesaContext);
  const router = useRouter();

  const abrirCategorias = (mesaSelecionada) => {
  selecionarMesa(mesaSelecionada); // salva no contexto
  router.push("/(protected)/visualizarcategorias");
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Selecione uma mesa</Text>

      <View style={styles.mesasContainer}>
        {mesas.map((mesa, index) => (
          <TouchableOpacity
            key={index}
            style={styles.mesaBox}
            activeOpacity={0.8}
            onPress={() => abrirCategorias(mesa)}
          >
            <Text style={styles.mesaNumero}>Mesa {mesa.numero}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8FAFD",
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E56A0",
    marginBottom: 20,
    textAlign: "center",
  },
  mesasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  mesaBox: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,

    // Sombra e borda moderna
    borderWidth: 1.5,
    borderColor: "#1E56A0",
    elevation: 4, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  mesaNumero: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E56A0",
  },
});
