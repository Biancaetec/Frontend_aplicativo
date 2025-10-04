import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Administração() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Linha 1 */}
      <View style={styles.linhaBotoes}>
        <TouchableOpacity onPress={() => router.push("/(protected)/mesa")} style={styles.botoes}>
          <View style={styles.coluna}>
            <MaterialIcons name="table-bar" size={28} color="#000" style={styles.iconeCima} />
            <Text style={styles.titulo}>Mesa</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(protected)/categoria")} style={styles.botoes}>
          <View style={styles.coluna}>
            <MaterialIcons name="category" size={28} color="#000" style={styles.iconeCima} />
            <Text style={styles.titulo}>Categoria</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Linha 2 */}
      <View style={styles.linhaBotoes}>
        <TouchableOpacity onPress={() => router.push("/(protected)/produto")} style={styles.botoes}>
          <View style={styles.coluna}>
            <MaterialIcons name="shopping-bag" size={28} color="#000" style={styles.iconeCima} />
            <Text style={styles.titulo}>Produto</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(protected)/FilaDePreparo")} style={styles.botoes}>
          <View style={styles.coluna}>
            <MaterialIcons name="schedule" size={28} color="#000" style={styles.iconeCima} />
            <Text style={styles.titulo}>Filas de preparo</Text>
          </View>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 28,
  },
  linhaBotoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  botoes: {
    backgroundColor: "#eee",
    width: "48%", // dois botões por linha
    height: 150,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  coluna: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  iconeCima: {
    marginBottom: 8,
  },
  titulo: {
    fontSize: 20,
    color: "#000",
    textAlign: "center",
  },
});
