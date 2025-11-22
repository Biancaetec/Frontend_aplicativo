import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MesaContext } from '../../MesaContext';
import { router } from 'expo-router';

export default function TelaMesas() {
  const { mesas, selecionarMesa, loading } = useContext(MesaContext);

  const mesasOrdenadas = [...mesas].sort((a, b) => a.numero - b.numero);

  function handleSelecionarMesa(mesa) {
    selecionarMesa(mesa);
    router.push('/visualizarmesa');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Text style={styles.titulo}>Visualização das Mesas</Text>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1E56A0" />
          <Text style={styles.loadingText}>Carregando mesas...</Text>
        </View>
      ) : (
        <FlatList
          data={mesasOrdenadas}
          keyExtractor={(item) => item.id_mesa.toString()}
          numColumns={3}
          contentContainerStyle={{ paddingTop: 20 }}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.mesa}
              onPress={() => handleSelecionarMesa(item)}
            >
              <Text style={styles.numeroMesa}>{item.numero}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* 🔵 Botão Novo Pedido */}
      <TouchableOpacity
        onPress={() => router.push('/visualizacao')}
        style={styles.botaopedido}
      >
        <Text style={styles.textobotao}>+ Novo pedido</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingBottom: '-30',
    paddingTop: '-20',
  },

  titulo: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E56A0',
    textAlign: 'center',
  },

  mesa: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#1E56A015',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E56A0',
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#1E56A0',
    fontSize: 16,
    fontWeight: '600',
  },

  numeroMesa: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E56A0',
  },

  botaopedido: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#1E56A0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 3,
    width: '50%',
    height: '12%',
    justifyContent: 'center',
    alignItems: 'center',
  
  },

  textobotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
