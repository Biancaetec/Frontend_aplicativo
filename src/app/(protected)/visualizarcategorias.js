// VisualizarCategorias.jsx
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { CategoriaContext } from "../../CategoriaContext";
import { ProdutoContext } from "../../ProdutoContext";
import { PedidoContext } from "../../PedidoContext";
import { MesaContext } from "../../MesaContext";

export default function VisualizarCategorias() {
  const router = useRouter();
  const { mesaSelecionada } = useContext(MesaContext);

  const { categorias, carregarCategorias, loading: loadingCategorias } = useContext(CategoriaContext);
  const { produtos, carregarProdutos, loading: loadingProdutos } = useContext(ProdutoContext);
  const { adicionarProduto, salvarCategoria } = useContext(PedidoContext);

  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [quantidades, setQuantidades] = useState({});

  useEffect(() => {
    carregarCategorias();
    carregarProdutos();
  }, []);

  useEffect(() => {
    if (categoriaSelecionada) {
      const filtrados = produtos.filter(p => p.id_categoria === categoriaSelecionada.id_categoria);
      setProdutosFiltrados(filtrados);
      setQuantidades({});
    } else {
      setProdutosFiltrados([]);
    }
  }, [categoriaSelecionada, produtos]);

  const alterarQuantidade = (id, delta) => {
    setQuantidades(prev => {
      const novaQtd = (prev[id] || 0) + delta;
      if (novaQtd < 0) return prev;
      return { ...prev, [id]: novaQtd };
    });
  };

  const salvarPedidoCategoria = () => {
    const selecionados = produtosFiltrados.filter(p => (quantidades[p.id_produto] || 0) > 0);

    if (selecionados.length === 0) {
      Alert.alert("Atenção", "Selecione ao menos um produto.");
      return;
    }

    selecionados.forEach(produto => {
      adicionarProduto(produto, quantidades[produto.id_produto]);
    });

    salvarCategoria(categoriaSelecionada.id_categoria);

    Alert.alert("Sucesso", "Itens adicionados ao pedido!");
    setQuantidades({});
    setCategoriaSelecionada(null);
  };

  if (loadingCategorias) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004aad" />
        <Text style={styles.loadingText}>Carregando categorias...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mesa {mesaSelecionada?.numero}</Text>

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
              categoriaSelecionada?.id_categoria === item.id_categoria && styles.categoriaSelecionada,
            ]}
            onPress={() => setCategoriaSelecionada(categoriaSelecionada?.id_categoria === item.id_categoria ? null : item)}
          >
            <Text style={[styles.categoriaTexto, categoriaSelecionada?.id_categoria === item.id_categoria && styles.categoriaTextoSelecionado]}>
              {item.nome}
            </Text>
          </TouchableOpacity>
        )}
      />

      {categoriaSelecionada && (
        <View style={styles.produtosContainer}>
          <Text style={styles.subtitulo}>Produtos de {categoriaSelecionada.nome}</Text>

          {loadingProdutos ? (
            <ActivityIndicator size="large" color="#004aad" />
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
                    <Text style={styles.produtoPreco}>R$ {Number(item.preco).toFixed(2)}</Text>
                  </View>

                  <View style={styles.controles}>
                    <TouchableOpacity style={styles.botaoQtd} onPress={() => alterarQuantidade(item.id_produto, -1)}>
                      <Text style={styles.qtdTexto}>−</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtdNumero}>{quantidades[item.id_produto] || 0}</Text>

                    <TouchableOpacity style={styles.botaoQtd} onPress={() => alterarQuantidade(item.id_produto, 1)}>
                      <Text style={styles.qtdTexto}>＋</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}

          <TouchableOpacity style={styles.botaoSalvar} onPress={salvarPedidoCategoria}>
            <Text style={styles.textoBotaoSalvar}>Salvar Categoria</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.botaoRevisar} onPress={() => router.push("/revisarpedido")}>
        <Text style={styles.textoBotaoRevisar}>Revisar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa", padding: 16 },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#004aad", textAlign: "center", marginBottom: 16 },
  categoriasContainer: { flexGrow: 0, marginBottom: 12, paddingHorizontal: 4, height: 45 },
  categoriaBotao: { flexDirection: "row", alignItems: "center", backgroundColor: "#e6e6e6", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14, marginRight: 10 },
  categoriaSelecionada: { backgroundColor: "#004aad" },
  categoriaTexto: { color: "#004aad", fontWeight: "600", fontSize: 15 },
  categoriaTextoSelecionado: { color: "#fff" },
  produtosContainer: { flex: 1, marginTop: 10, marginBottom: 70 },
  subtitulo: { fontSize: 18, fontWeight: "600", color: "#004aad", marginBottom: 10, textAlign: "center" },
  produtoBox: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: "#dce3f0" },
  produtoNome: { fontSize: 16, fontWeight: "500" },
  produtoPreco: { fontSize: 14, color: "#666" },
  controles: { flexDirection: "row", alignItems: "center" },
  botaoQtd: { backgroundColor: "#004aad", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  qtdTexto: { color: "#fff", fontSize: 18 },
  qtdNumero: { fontSize: 16, fontWeight: "bold", marginHorizontal: 10 },
  botaoSalvar: { backgroundColor: "#009688", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 10 },
  textoBotaoSalvar: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  botaoRevisar: { position: "absolute", bottom: 25, left: 20, right: 20, backgroundColor: "#004aad", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  textoBotaoRevisar: { color: "#fff", fontSize: 17, fontWeight: "600" },
  semProdutos: { textAlign: "center", color: "#777", marginTop: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#004aad" },
});
