import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { MesaContext } from '../../MesaContext';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Mesa() {
  const { mesas, carregarMesas, excluirMesa } = useContext(MesaContext);
  const navigation = useNavigation();

  useEffect(() => {
    carregarMesas();
  }, []);

  const handleEditar = (mesa) => {
    navigation.navigate('editarmesa', { mesa });
  };

  const handleExcluir = (id_mesa) => {
    Alert.alert(
      'Confirmação',
      'Deseja realmente excluir esta mesa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => excluirMesa(id_mesa) }
      ]
    );
  };

  const renderMesa = ({ item }) => (
    <View style={[styles.mesaContainer, { borderColor: item.ocupada ? 'red' : 'green' }]}>
      <Text style={styles.mesaNumero}>Mesa {item.numero}</Text>
      <Text style={styles.mesaDescricao}>{item.descricao}</Text>

      <View style={styles.botoesContainer}>
        <TouchableOpacity style={styles.botaoEditar} onPress={() => handleEditar(item)}>
          <Text style={styles.textoBotao}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleExcluir(item.id_mesa)}>
          <MaterialIcons name="delete" size={26} color="#d11a2a" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {mesas.length === 0 ? (
        <Text style={styles.semMesas}>Nenhuma mesa cadastrada.</Text>
      ) : (
        <FlatList
          key={'3col'}
          data={mesas}
          keyExtractor={(item) => item.id_mesa.toString()}
          renderItem={renderMesa}
          numColumns={3} // ➤ 3 mesas por linha
          columnWrapperStyle={{ justifyContent: 'space-between' }} // espaçamento entre colunas
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.botaoFlutuante}
        onPress={() => navigation.navigate('novamesa')}
      >
        <Text style={styles.textoBotaoFlutuante}>+ Criar nova mesa</Text>
      </TouchableOpacity>
    </View>
  );
}

// calcula o tamanho das mesas proporcional à tela
const screenWidth = Dimensions.get('window').width;
const itemSize = (screenWidth - 60) / 3; // 3 mesas com margens entre elas

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  semMesas: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 50,
  },
  mesaContainer: {
    width: itemSize,
    height: itemSize,
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mesaNumero: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  mesaDescricao: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    alignItems: 'center',
  },
  botaoEditar: {
    backgroundColor: '#004aad',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
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
  textoBotaoFlutuante: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
