import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function novacategoria() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Página de criação de nova categoria</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  texto: {
    fontSize: 18,
    color: '#333',
  },
});
