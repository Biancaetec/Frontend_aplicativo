import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { CategoriaContext } from "../../CategoriaContext";
import { ProdutoContext } from "../../ProdutoContext";
import { PedidoContext } from "../../PedidoContext";

export default function VisualizarCategorias() {
  const { numeroMesa } = useLocalSearchParams();
  const { categorias, carregarCategorias, loading: loadingCategorias } =
    useContext(CategoriaContext);
  const { produtos, carregarProdutos, carregarProdutosPorCategoria, loading } =
    useContext(ProdutoContext);
  const { adicionarProduto, salvarCategoria } = useContext(PedidoContext);

  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [quantidades, setQuantidades] = useState({}); // controle de qtd por produto

  useEffect(() => {
    carregarCategorias();
    carregarProdutos();
  }, []);

  useEffect(() => {
    if (categoriaSelecionada) {
      const filtrados = carregarProdutosPorCategoria(
        categoriaSelecionada.id_categoria
      );
      setProdutosFiltrados(filtrados);
    } else {
      setProdutosFiltrados([]);
    }
    setQuantidades({}); // resetar quantidades ao trocar categoria
  }, [categoriaSelecionada, produtos]);

  const alterarQuantidade = (id, delta) => {
    setQuantidades((prev) => {
      const novaQtd = (prev[id] || 0) + delta;
      if (novaQtd < 0) return prev;
      return { ...prev, [id]: novaQtd };
    });
  };

  const salvarPedidoCategoria = () => {
    const selecionados = produtosFiltrados.filter(
      (p) => quantidades[p.id_produto] > 0
    );

    if (selecionados.length === 0) return alert("Selecione ao menos um produto!");

    selecionados.forEach((produto) => {
      adicionarProduto({
        mesa: numeroMesa,
        produto: produto,
        quantidade: quantidades[produto.id_produto],
      });
    });

    salvarCategoria(categoriaSelecionada.id_categoria);
    alert("Categoria salva com sucesso!");
    setQuantidades({});
    setCategoriaSelecionada(null);
  };

  if (loadingCategorias) {
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
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriasContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoriaBotao,
                categoriaSelecionada?.id_categoria === item.id_categoria &&
                  styles.categoriaSelecionada,
              ]}
              onPress={() =>
                setCategoriaSelecionada(
                  categoriaSelecionada?.id_categoria === item.id_categoria
                    ? null
                    : item
                )
              }
            >
              <Text
                style={[
                  styles.categoriaTexto,
                  categoriaSelecionada?.id_categoria === item.id_categoria &&
                    styles.categoriaTextoSelecionado,
                ]}
              >
                {item.nome}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {categoriaSelecionada && (
        <View style={styles.produtosContainer}>
          <Text style={styles.subtitulo}>
            Produtos de {categoriaSelecionada.nome}
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#0d4086ff" />
          ) : produtosFiltrados.length === 0 ? (
            <Text style={styles.semProdutos}>Nenhum produto encontrado.</Text>
          ) : (
            <FlatList
              data={produtosFiltrados}
              keyExtractor={(item) => item.id_produto.toString()}
              renderItem={({ item }) => (
                <View style={styles.produtoBox}>
                  <View>
                    <Text style={styles.produtoNome}>{item.nome}</Text>
                    <Text style={styles.produtoPreco}>
                      R$ {Number(item.preco).toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.controles}>
                    <TouchableOpacity
                      style={styles.botaoQtd}
                      onPress={() => alterarQuantidade(item.id_produto, -1)}
                    >
                      <Text style={styles.qtdTexto}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtdNumero}>
                      {quantidades[item.id_produto] || 0}
                    </Text>
                    <TouchableOpacity
                      style={styles.botaoQtd}
                      onPress={() => alterarQuantidade(item.id_produto, 1)}
                    >
                      <Text style={styles.qtdTexto}>＋</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}

          {/* Botão de salvar categoria */}
          <TouchableOpacity
            style={styles.botaoSalvar}
            onPress={salvarPedidoCategoria}
          >
            <Text style={styles.textoBotaoSalvar}>Salvar Categoria</Text>
          </TouchableOpacity>
        </View>
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
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  categoriasContainer: {
    paddingBottom: 10,
  },
  categoriaBotao: {
    backgroundColor: "#0d4086ff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  categoriaSelecionada: {
    backgroundColor: "#092b59ff",
  },
  categoriaTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  categoriaTextoSelecionado: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  produtosContainer: {
    marginTop: 20,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0d4086ff",
    marginBottom: 10,
  },
  produtoBox: {
    backgroundColor: "#eaf0ff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#c7d8ff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  produtoPreco: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },
  controles: {
    flexDirection: "row",
    alignItems: "center",
  },
  botaoQtd: {
    backgroundColor: "#0d4086ff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtdTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  qtdNumero: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: "center",
  },
  botaoSalvar: {
    marginTop: 15,
    backgroundColor: "#0d4086ff",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  textoBotaoSalvar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  semCategorias: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 50,
  },
  semProdutos: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
    marginTop: 30,
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
