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
        <TouchableOpacity onPress={() => router.push('/(protected)/categoria')} style={styles.botoes}>
          <View style={styles.linha}>
            <MaterialIcons name="category" size={24} color="#000" style={styles.icone} />
            <Text style={styles.titulo}>Categoria</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(protected)/nomedoscadastros')} style={styles.botoes}>
          <View style={styles.linha}>
            <MaterialIcons name="shopping-bag" size={24} color="#000" style={styles.icone} />
            <Text style={styles.titulo}>Produto</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Linha 2 */}
      <View style={styles.linhaBotoes}>
        <TouchableOpacity onPress={() => router.push('/(protected)/adicional')} style={styles.botoes}>
          <View style={styles.linha}>
            <MaterialIcons name="add-circle-outline" size={24} color="#000000ff" style={styles.icone} />
            <Text style={styles.titulo}>Adicionais</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(protected)/mesa')} style={styles.botoes}>
          <View style={styles.linha}>
            <MaterialIcons name="table-bar" size={24} color="#000" style={styles.icone} />
            <Text style={styles.titulo}>Mesa</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Linha 3 - botão solitário */}
      <View style={styles.linhaBotoes}>
        <TouchableOpacity onPress={() => router.push('/(protected)/nomedoscadastros')} style={[styles.botoes, { width: "100%" }]}>
          <View style={styles.linha}>
            <MaterialIcons name="schedule" size={24} color="#000" style={styles.icone} />
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
    padding: 20,
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
    height: 100,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
  },
  icone: {
    marginRight: 16,
  },
  titulo: {
    fontSize: 20,
    color: "#000",
  },
});
