import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Administração() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Painel Administrativo</Text>

      {/* Linha 1 */}
      <View style={styles.linhaBotoes}>
        <TouchableOpacity
          onPress={() => router.push("/(protected)/mesa")}
          style={styles.botoes}
        >
          <View style={styles.coluna}>
            <MaterialIcons
              name="table-bar"
              size={36}
              color="#4A90E2"
              style={styles.iconeCima}
            />
            <Text style={styles.titulo}>Mesas</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(protected)/categoria")}
          style={styles.botoes}
        >
          <View style={styles.coluna}>
            <MaterialIcons
              name="category"
              size={36}
              color="#50C878"
              style={styles.iconeCima}
            />
            <Text style={styles.titulo}>Categorias</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Linha 2 */}
      <View style={styles.linhaBotoes}>
        <TouchableOpacity
          onPress={() => router.push("/(protected)/produto")}
          style={styles.botoes}
        >
          <View style={styles.coluna}>
            <MaterialIcons
              name="shopping-bag"
              size={36}
              color="#F5A623"
              style={styles.iconeCima}
            />
            <Text style={styles.titulo}>Produtos</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(protected)/FilaDePreparo")}
          style={styles.botoes}
        >
          <View style={styles.coluna}>
            <MaterialIcons
              name="schedule"
              size={36}
              color="#E94E77"
              style={styles.iconeCima}
            />
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
    backgroundColor: "#F8FAFD",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginBottom: 30,
  },
  linhaBotoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  botoes: {
    backgroundColor: "#fff",
    width: "48%",
    height: 150,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // sombra no Android
    shadowColor: "#000", // sombra no iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    padding: 12,
  },
  coluna: {
    alignItems: "center",
  },
  iconeCima: {
    marginBottom: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
