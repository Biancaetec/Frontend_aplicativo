import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { CategoriaContext } from '../../CategoriaContext';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Categoria() {
  const { categorias, carregarCategorias, excluirCategoria } = useContext(CategoriaContext);
  const navigation = useNavigation();

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleExcluir = (id_categoria) => {
    Alert.alert(
      'Confirmação',
      'Deseja realmente excluir esta categoria?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => excluirCategoria(id_categoria) }
      ]
    );
  };

  const renderCategoria = ({ item }) => (
    <View style={styles.categoriaContainer}>
      <Text style={styles.categoriaNome}>{item.nome}</Text>

      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => navigation.navigate('editarcategoria', { categoriaEditando: item })}
        >
          <Text style={styles.textoBotao}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleExcluir(item.id_categoria)}>
          <MaterialIcons name="delete" size={26} color="#d11a2a" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {categorias.length === 0 ? (
        <Text style={styles.semCategorias}>Nenhuma categoria cadastrada.</Text>
      ) : (
        <FlatList
          data={categorias}
          keyExtractor={(item) => item.id_categoria.toString()}
          renderItem={renderCategoria}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        />
      )}

      <TouchableOpacity
        style={styles.botaoFlutuante}
        onPress={() => navigation.navigate('novacategoria')}
      >
        <Text style={styles.textoBotaoFlutuante}>+ Criar nova categoria</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  semCategorias: { fontSize: 16, color: '#555', textAlign: 'center', marginTop: 50 },
  categoriaContainer: {
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 15,
    borderColor: '#0d4086ff',
  },
  categoriaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000ff',
    marginBottom: 10,
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
