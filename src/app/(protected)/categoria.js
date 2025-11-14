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

        <TouchableOpacity style={styles.botaoExcluir} onPress={() => handleExcluir(item.id_categoria)}>
          <MaterialIcons name="delete" size={22} color="#d11a2a" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gestão de Categorias</Text>
      {categorias.length === 0 ? (
        <Text style={styles.semCategorias}>Nenhuma categoria cadastrada.</Text>
      ) : (
        <FlatList
          data={categorias}
          keyExtractor={(item) => item.id_categoria.toString()}
          renderItem={renderCategoria}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
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
  container: { 
    flex: 1, 
    padding: 15, 
    backgroundColor: '#fff' 
  },

  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E56A0",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 10
  },

  semCategorias: { 
    fontSize: 16, 
    color: '#555', 
    textAlign: 'center', 
    marginTop: 50 
  },

  categoriaContainer: {
    borderWidth: 1.5,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 15,
    borderColor: '#004aad',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  categoriaNome: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },

  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },

  botaoEditar: {
    backgroundColor: '#004aad',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  botaoExcluir: {
    backgroundColor: '#f5f5f5',
    padding: 6,
    borderRadius: 8,
  },

  textoBotao: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 13 
  },

  botaoFlutuante: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: '#004aad',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 28,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },

  textoBotaoFlutuante: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 15 
  },
});
