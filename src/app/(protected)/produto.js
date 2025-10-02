import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CategoriaContext } from '../../CategoriaContext';
import { ProdutoContext } from '../../ProdutoContext';

export default function Produtos() {
  const { categorias } = useContext(CategoriaContext);
  const { produtos } = useContext(ProdutoContext);
  const navigation = useNavigation();

  const [categoriaAberta, setCategoriaAberta] = useState(null);

  const toggleCategoria = (id) => {
    setCategoriaAberta(categoriaAberta === id ? null : id);
  };

  if (categorias.length === 0) {
    return (
      <View style={styles.semCategoriasContainer}>
        <Text style={styles.aviso}>
          As categorias cadastradas aparecerão aqui.
        </Text>

        <TouchableOpacity
          style={styles.botaoNovaCategoria}
          onPress={() => navigation.navigate('novacategoria')}
        >
          <Text style={styles.botaoTexto}>+ Criar nova categoria</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id}
        renderItem={({ item: categoria }) => {
          const produtosDaCategoria = produtos.filter(p => p.categoriaId === categoria.id);
          const aberta = categoriaAberta === categoria.id;

          return (
            <View style={styles.categoriaContainer}>

              {/* Botão expandir/collapse */}
              <TouchableOpacity
                style={styles.categoriaBotao}
                onPress={() => toggleCategoria(categoria.id)}
              >
                <Text style={styles.categoriaTexto}>{categoria.nome}</Text>
                <Text style={styles.toggle}>{aberta ? '-' : '+'}</Text>
              </TouchableOpacity>

              {/* Lista de produtos e botão cadastrar */}
              {aberta && (
                <View style={styles.produtosContainer}>
                  {produtosDaCategoria.length === 0 ? (
                    <Text style={styles.semProduto}>Nenhum produto nesta categoria</Text>
                  ) : (
                    produtosDaCategoria.map(prod => (
                      <Text key={prod.id} style={styles.produtoTexto}>- {prod.nome}</Text>
                    ))
                  )}

                  {/* Botão Cadastrar */}
                  <View style={styles.botaoCadastrarContainer}>
                    <TouchableOpacity
                      style={styles.botaoCadastrar}
                      onPress={() => navigation.navigate('novoproduto', { categoriaId: categoria.id })}
                    >
                      <Text style={styles.textoCadastrar}>Cadastrar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        }}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
      />

      {/* Botão criar nova categoria */}
      <TouchableOpacity
        style={styles.botaoNovaCategoria}
        onPress={() => navigation.navigate('novacategoria')}
      >
        <Text style={styles.botaoTexto}>+ Criar nova categoria</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  semCategoriasContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  aviso: { fontSize: 16, color: '#666', fontStyle: 'italic', textAlign: 'center', paddingHorizontal: 20, marginBottom: 20 },
  categoriaContainer: { marginBottom: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E3F2FD' },
  categoriaBotao: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#E3F2FD', borderRadius: 12 },
  categoriaTexto: { fontSize: 16, color: '#0D3A87', fontWeight: '500' },
  toggle: { fontSize: 18, color: '#0D3A87', fontWeight: 'bold' },
  produtosContainer: { padding: 12, backgroundColor: '#F5F6FA', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  produtoTexto: { fontSize: 15, color: '#0D3A87', marginVertical: 2 },
  semProduto: { fontSize: 14, color: '#666', fontStyle: 'italic' },

  botaoCadastrarContainer: { alignItems: 'flex-end', marginTop: 10 },
  botaoCadastrar: { backgroundColor: '#28a745', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
  textoCadastrar: { color: '#fff', fontWeight: 'bold' },

  botaoNovaCategoria: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#004aad', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20 },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
});
