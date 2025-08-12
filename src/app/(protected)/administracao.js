import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Administração() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/(protected)/categoria')} style={styles.botoes}>
        <View style={styles.linha}>
          <MaterialIcons name="category" size={24} color="#fff" style={styles.icone} />
          <Text style={styles.titulo}>Categoria</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(protected)/nomedoscadastros')} style={styles.botoes}>
        <View style={styles.linha}>
          <MaterialIcons name="shopping-bag" size={24} color="#fff" style={styles.icone} />
          <Text style={styles.titulo}>Produto</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(protected)/adicional')} style={styles.botoes}>
        <View style={styles.linha}>
          <MaterialIcons name="add-circle-outline" size={24} color="#fff" style={styles.icone} />
          <Text style={styles.titulo}>Adicionais</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(protected)/nomedoscadastros')} style={styles.botoes}>
        <View style={styles.linha}>
          <MaterialIcons name="table-bar" size={24} color="#fff" style={styles.icone} />
          <Text style={styles.titulo}>Mesa</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(protected)/nomedoscadastros')} style={styles.botoes}>
        <View style={styles.linha}>
          <MaterialIcons name="schedule" size={24} color="#fff" style={styles.icone} />
          <Text style={styles.titulo}>Filas de preparo</Text>
        </View>
      </TouchableOpacity>
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
  botoes: {
    backgroundColor: "#999",
    borderRadius: 16,
    height: 55,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 40, 
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
    color: "#fff",
  },
});
