import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
// esse useLocalSearchParams serve para pegar os parametros passados na navegação e jogar para cá 
import { CategoriaContext } from "../../CategoriaContext";

export default function VisualizarCategorias() {
  const { numeroMesa } = useLocalSearchParams();
  const { categorias, carregarCategorias, loading } = useContext(CategoriaContext);
  const router = useRouter();

  // Carrega as categorias ao abrir a tela
  useEffect(() => {
    carregarCategorias();
  }, []);

  const abrirProdutos = (categoriaSelecionada) => {
    router.push({
      pathname: "/(protected)/visualizarprodutos",
      params: {
        numeroMesa,
        id_categoria: categoriaSelecionada.id_categoria,
        nomeCategoria: categoriaSelecionada.nome,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#030274ff" />
        <Text style={styles.loadingText}>Carregando categorias...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mesa {numeroMesa}</Text>

      {categorias.length === 0 ? (
        <Text style={styles.semCategorias}>Nenhuma categoria cadastrada.</Text>
      ) : (
        <FlatList
          data={categorias}
          keyExtractor={(item) => item.id_categoria.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoriaBox}
              onPress={() => abrirProdutos(item)}
            >
              <Text style={styles.categoriaTexto}>{item.nome}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000ff",
    textAlign: "center",
    marginBottom: 20,
  },
  categoriaBox: {
    backgroundColor: "#0d4086ff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#0d4086ff",
  },
  categoriaTexto: {
    fontSize: 18,
    color: "#ffffffff",
    fontWeight: "600",
    textAlign: "center",
  },
  semCategorias: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1f63bdff",
  },
});
