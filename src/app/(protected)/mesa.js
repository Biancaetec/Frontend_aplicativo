import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MesaContext } from '../../MesaContext';

export default function Mesa() {
  const { mesas } = useContext(MesaContext);
  const navigation = useNavigation();

  // Ordena as mesas pelo número
  const mesasOrdenadas = [...mesas].sort((a, b) => a.numero - b.numero);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={mesasOrdenadas}
        keyExtractor={(_, index) => index.toString()}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'space-around', marginBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.mesaBox}>
            <Text style={styles.mesaTexto}>{item.numero}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.semMesasContainer}>
            <Ionicons name="restaurant-outline" size={48} color="#555" />
            <Text style={styles.semMesasTexto}>Nenhuma mesa cadastrada.</Text>
          </View>
        }
        contentContainerStyle={{ padding: 20, flexGrow: 1 }}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('novamesa')}
      >
        <Text style={styles.botaoTexto}>+ Adicionar Mesa</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mesaBox: {
    width: '28%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mesaTexto: { fontSize: 18, fontWeight: 'bold', color: '#0D3A87' },
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
  semMesasContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  semMesasTexto: { fontSize: 16, color: '#555', marginTop: 10 },
});
