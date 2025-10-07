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

  const handleEditar = (mesa) => {
    navigation.navigate('novamesa', { mesaEditando: JSON.stringify(mesa) });
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
          <Text style={styles.botaoTexto}>Editar</Text>
        </TouchableOpacity>

        {/* Ícone de lixeira */}
        <TouchableOpacity onPress={() => handleExcluir(item.id_mesa)}>
          <MaterialIcons name="delete" size={28} color="#d11a2a" style={{ marginLeft: 30 }} />
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
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  semMesas: { fontSize: 16, color: '#555', textAlign: 'center', marginTop: 50 },
  mesaContainer: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    width: '35%',
    height: '29%',
  },
  mesaNumero: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  mesaDescricao: { fontSize: 14, color: '#555', marginBottom: 10},
  botoesContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '60%',  },
  botaoEditar: { backgroundColor: '#004aad', padding: 6, borderRadius: 8, flex: 1, marginRight: 10, alignItems: 'center', width: '50%' },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
});
