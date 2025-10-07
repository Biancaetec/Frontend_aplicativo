import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { MesaContext } from '../../MesaContext';
import { useRouter } from 'expo-router';

export default function Mesa() {
  const { mesas, buscarMesas, loading } = useContext(MesaContext);
  const router = useRouter();

  // Carrega as mesas ao entrar na tela
  useEffect(() => {
    buscarMesas();
  }, []);

  // Renderização de cada item
  const renderMesa = ({ item }) => (
    <View
      style={[
        styles.card,
        { borderColor: item.ocupada ? '#ff4d4d' : '#00cc66' },
      ]}
    >
      <Text style={styles.numero}>Mesa {item.numero}</Text>
      <Text style={styles.descricao}>{item.descricao || 'Sem descrição'}</Text>
      <Text style={styles.status}>
        Status: {item.ocupada ? 'Ocupada' : 'Livre'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mesas Cadastradas</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#004aad" />
      ) : mesas.length === 0 ? (
        <Text style={styles.mensagem}>Nenhuma mesa cadastrada.</Text>
      ) : (
        <FlatList
          data={mesas}
          keyExtractor={(item) => item.id_mesa.toString()}
          renderItem={renderMesa}
        />
      )}

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push('/novamesa')}
      >
        <Text style={styles.botaoTexto}>+ Adicionar Mesa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#004aad', marginBottom: 20, textAlign: 'center' },
  card: {
    backgroundColor: '#f9f9f9',
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  numero: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  descricao: { fontSize: 14, color: '#666', marginTop: 5 },
  status: { fontSize: 14, marginTop: 8, color: '#004aad' },
  mensagem: { textAlign: 'center', color: '#555', fontSize: 16, marginTop: 30 },
  botao: {
    backgroundColor: '#004aad',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
