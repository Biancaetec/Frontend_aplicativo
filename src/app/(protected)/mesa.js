import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { MesaContext } from '../../MesaContext';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BotaoVoltar from '../(protected)/botaovoltar';

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
      {/* Nome da mesa centralizado */}
      <Text style={styles.mesaNome}>Mesa {item.numero}</Text>

      {/* Botões na parte inferior */}
      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => navigation.navigate('editarmesa', { mesaEditando: item })}
        >
          <Text style={styles.textoBotao}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={() => handleExcluir(item.id_mesa)}
        >
          <MaterialIcons name="delete" size={22} color="#d11a2a" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gestão de Mesas</Text>
      {mesas.length === 0 ? (
        <Text style={styles.semMesas}>Nenhuma mesa cadastrada.</Text>
      ) : (
        <FlatList
          data={mesas}
          keyExtractor={(item) => item.id_mesa.toString()}
          renderItem={renderMesa}
          numColumns={3}
          key={3}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
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
  container: {
    flex: 1,
    padding: 4,
    backgroundColor: '#fff'
  },

  semMesas: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 50
  },

  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E56A0",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 20
  },

  mesaContainer: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    backgroundColor: '#fff',
    margin: 2,
    width: '32%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    position: 'relative',
    height: 100,
  },

  mesaNome: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },

  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5, // espaçamento entre os botões
  },

  botaoEditar: {
    backgroundColor: '#004aad',
    paddingVertical: 6,
    paddingHorizontal: 12,
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
