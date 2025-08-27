import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MesaContext } from '../../MesaContext';

export default function Mesa() {
  const { mesas } = useContext(MesaContext);
  const navigation = useNavigation();

  // Ordena as mesas pelo número antes de renderizar
  const mesasOrdenadas = [...mesas].sort((a, b) => a.numero - b.numero);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.mesasContainer}>
        {mesasOrdenadas.map((mesa, index) => (
          <View key={index} style={styles.mesaBox}>
            <Text style={styles.mesaTexto}>{mesa.numero}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('novamesa')}
      >
        <Text style={styles.textoBotao}>+ Adicionar Mesa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flexGrow: 1 },
  mesasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mesaBox: {
    width: '28%', // 4 mesas por linha
    height: '28%', // Mantém a proporção quadrada
    aspectRatio: 1,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mesaTexto: { fontSize: 18, fontWeight: 'bold', color: '#0D3A87' },
  botao: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#004aad', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20 },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
});
