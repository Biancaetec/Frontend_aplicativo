import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FilaContext } from '../../FilaContext';

export default function NovaFila() {
  const [nomeFila, setNomeFila] = useState('');
  const { adicionarFila } = useContext(FilaContext);

  const salvarFila = () => {
    if (nomeFila.trim() === '') {
      Alert.alert('Erro', 'Digite o nome da fila de preparo.');
      return;
    }
    adicionarFila({ nome: nomeFila });
    Alert.alert('Sucesso', 'Fila de preparo cadastrada!');
    setNomeFila(''); // limpa o input
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Fila de Preparo</Text>

      <TextInput
        placeholder="Cozinha, Freezer..."
        style={styles.input}
        value={nomeFila}
        onChangeText={setNomeFila}
        placeholderTextColor="#A9A9A9"
      />

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarFila}>
        <Text style={styles.textoBotao}>Salvar fila de preparo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F6FA' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#0D3A87', marginBottom: 20, textAlign: 'center' },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#0D3A87',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    color: '#333',
    fontSize: 16,
  },
  botaoSalvar: {
    backgroundColor: '#0D3A87',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
