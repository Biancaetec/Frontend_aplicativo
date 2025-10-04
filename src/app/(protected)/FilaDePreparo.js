import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router'; // router do expo-router
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { FilaContext } from '../../FilaContext';

export default function FilaDePreparo() {
  const router = useRouter();
  const { filas } = useContext(FilaContext);

  const semFilas = filas.length === 0;

  const irParaPedidosDaFila = (fila) => {
    // Passa o nome da fila via query string
    router.push({
      pathname: '/(protected)/pedidosdafila',
      params: { filaNome: fila.nome },
    });
  };

  return (
    <View style={styles.container}>
      {semFilas ? (
        <View style={styles.semFilasContainer}>
          <FontAwesome5 name="clock" size={48} color="#555" />
          <Text style={styles.semFilasTexto}>
            As filas de preparo cadastradas aparecerão aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filas}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.filaItem}
              onPress={() => irParaPedidosDaFila(item)}
            >
              <Text style={styles.filaTexto}>{item.nome}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ padding: 20, flexGrow: 1 }}
        />
      )}

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push('/(protected)/novafila')}
      >
        <Text style={styles.botaoTexto}>+ Criar nova fila de preparo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  botao: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#004aad',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  filaItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#0D3A87',
  },
  filaTexto: { fontSize: 16, color: '#0D3A87', fontWeight: '500' },
  semFilasContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  semFilasTexto: { fontSize: 16, color: '#555', marginTop: 10, textAlign: 'center' },
});
