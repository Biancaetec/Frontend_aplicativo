import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { ProdutoContext } from '../../ProdutoContext';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

export default function Produtos() {
  const { produtos, carregarProdutos, excluirProduto } = useContext(ProdutoContext);
  const navigation = useNavigation();

  // Carrega os produtos ao abrir a tela
  useEffect(() => {
    carregarProdutos();
  }, []);

  // Confirmação antes de excluir
  const handleExcluir = (id_produto) => {
    Alert.alert(
      'Confirmação',
      'Deseja realmente excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => excluirProduto(id_produto) }
      ]
    );
  };

  // Renderiza cada item da FlatList
  const renderProduto = ({ item }) => (
    <View style={styles.produtoContainer}>
      <View style={styles.produtoInfo}>
        {item.imagem ? (
          <Image source={{ uri: item.imagem }} style={styles.imagem} />
        ) : (
          <View style={styles.imagemVazia}>
            <Text style={styles.imagemVaziaTexto}>Sem imagem</Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.produtoNome}>{item.nome}</Text>
          {item.descricao ? <Text style={styles.produtoDescricao}>{item.descricao}</Text> : null}
          {item.id_categoria ? (
            <Text style={styles.produtoCategoria}>Categoria ID: {item.id_categoria}</Text>
          ) : null}
          {item.preco && <Text style={styles.produtoPreco}>R$ {item.preco}</Text>}
        </View>
      </View>

      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() =>
            router.push({
              pathname: '/(protected)/editarproduto',
              params: { produtoEditando: JSON.stringify(item) }, // ⚠️ precisa serializar objetos
            })
          }>
          <Text style={styles.textoBotao}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleExcluir(item.id_produto)}>
          <MaterialIcons name="delete" size={26} color="#d11a2a" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
    <Text style={styles.titulo}>Gestão de Produtos</Text>
      {produtos.length === 0 ? (
        <Text style={styles.semProdutos}>Nenhum produto cadastrado.</Text>
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id_produto.toString()}
          renderItem={renderProduto}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        />
      )}

      {/* Botão flutuante */}
      <TouchableOpacity
        style={styles.botaoFlutuante}
        onPress={() => navigation.navigate('novoproduto')}
      >
        <Text style={styles.textoBotaoFlutuante}>+ Criar novo produto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  semProdutos: { fontSize: 16, color: '#555', textAlign: 'center', marginTop: 50 },
  produtoContainer: {
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 15,
    borderColor: '#0d4086ff',
  },

  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E56A0",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 10
  },

  produtoInfo: { flexDirection: 'row', alignItems: 'center' },
  imagem: { width: 70, height: 70, borderRadius: 8, marginRight: 10, backgroundColor: '#eee' },
  imagemVazia: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  imagemVaziaTexto: { fontSize: 10, color: '#888' },
  produtoNome: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 3 },
  produtoDescricao: { fontSize: 13, color: '#555', marginBottom: 3 },
  produtoCategoria: { fontSize: 12, color: '#777', marginBottom: 3 },
  produtoPreco: { fontSize: 14, fontWeight: '600', color: '#0d4086ff' },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  botaoEditar: {
    backgroundColor: '#004aad',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
  botaoFlutuante: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: '#004aad',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 25,
    elevation: 5,
  },
  textoBotaoFlutuante: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
