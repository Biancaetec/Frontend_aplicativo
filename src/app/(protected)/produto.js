import React, { useContext, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ProdutoContext } from '../../ProdutoContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Produtos() {
  const { produtos } = useContext(ProdutoContext);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {produtos.length === 0 ? (
          <View style={styles.semProdutosContainer}>
            <Ionicons name="cube-outline" size={50} color="#555" />
            <Text style={styles.semProdutos}>Nenhum produto cadastrado.</Text>
          </View>
        ) : (
          produtos.map((produto, index) => (
            <View key={index} style={styles.produtoBox}>
              {produto.imagem ? (
                <Image source={{ uri: produto.imagem }} style={styles.imagem} />
              ) : (
                <View style={styles.imagemVazia}>
                  <Text style={styles.imagemVaziaTexto}>Sem imagem</Text>
                </View>
              )}
              <View style={styles.info}>

                <Text style={styles.nome}>{produto.nome}</Text>
                <Text style={styles.descricao}>{produto.descricao}</Text>
                <Text style={styles.tipo}>Tipo: {produto.tipo}</Text>
                <Text style={styles.valor}>Valor: R$ {produto.valor}</Text>
                {produto.adicionais && produto.adicionais.length > 0 && (
                  <View style={styles.adicionaisContainer}>
                    <Text style={styles.adicionaisTitulo}>Adicionais:</Text>
                    {produto.adicionais.map((adicional, i) => (
                      <Text key={i} style={styles.adicionalItem}>
                        {adicional.nome} - R$ {adicional.custo}
                      </Text>
                    ))}
                  </View>
                )}

                <View style={styles.botoesContainer}>
                  <TouchableOpacity
                    style={styles.botaoEditar}
                    onPress={() => navigation.navigate('editarproduto', { produtoEditando: item })}
                  >
                    <Text style={styles.textoBotao}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleExcluir(item.id_produto)}>
                    <MaterialIcons name="delete" size={26} color="#d11a2a" />
                  </TouchableOpacity></View></View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Botão flutuante para adicionar novo produto */}
      <TouchableOpacity
        style={styles.botaoNovoProduto}
        onPress={() => navigation.navigate('novoproduto')}
      >
        <Text style={styles.textoBotao}>+ Novo Produto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  scrollContainer: { paddingBottom: 100 },
  semProdutosContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  semProdutos: { textAlign: 'center', marginTop: 10, fontSize: 16, color: '#555' },
  produtoBox: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    alignItems: 'center',
  },
  imagem: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  imagemVazia: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  imagemVaziaTexto: { fontSize: 10, color: '#888' },
  info: { flex: 1 },
  nome: { fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  descricao: { color: '#555', fontSize: 14, marginBottom: 2 },
  tipo: { fontSize: 14, marginBottom: 2 },
  valor: { fontWeight: 'bold', fontSize: 14 },
  adicionaisContainer: { marginTop: 4 },
  adicionaisTitulo: { fontWeight: '600', fontSize: 13 },
  adicionalItem: { fontSize: 12, color: '#555' },
  botaoNovoProduto: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#004aad',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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

