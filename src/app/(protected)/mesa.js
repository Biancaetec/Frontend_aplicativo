import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { MesaContext } from '../../MesaContext';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Mesa() {
  const { mesas, carregarMesas, excluirMesa } = useContext(MesaContext);
  const navigation = useNavigation();

  useEffect(() => {
    carregarMesas();
  }, []);

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
    <View style={styles.mesaContainer}>
      <Text style={styles.mesaNome}>Mesa {item.numero}</Text>

      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => navigation.navigate('editarmesa', { mesaEditando: item })}
        >
          <Text style={styles.textoBotao}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconeExcluir} onPress={() => handleExcluir(item.id_mesa)}>
          <MaterialIcons name="delete" size={26} color="#d11a2a" style={{ marginLeft: 10 }} />
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
          data={mesas}
          keyExtractor={(item) => item.id_mesa.toString()}
          renderItem={renderMesa}
          numColumns={3} 
          key={3}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  semMesas: { fontSize: 16, color: '#555', textAlign: 'center', marginTop: 50 },
  mesaContainer: {
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#fff',
    margin: 5,
    width: '30%', 
    aspectRatio: 1, // deixa quadrado
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    position: 'relative',
  },
  mesaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000ff',
    textAlign: 'center',
    marginBottom: 5,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  botaoEditar: {
    backgroundColor: '#004aad',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 5,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
iconeExcluir: {
     position: 'absolute',
     marginTop: '-160%',
     marginRight: '-106%',
     zIndex: 10,
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
  textoBotaoFlutuante: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
