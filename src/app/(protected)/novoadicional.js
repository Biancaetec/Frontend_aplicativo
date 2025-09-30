import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AdicionalContext } from '../../AdicionalContext';

export default function NovoAdicional() {
  const [nomeAdicional, setNomeAdicional] = useState('');
  const [precoAdicional, setPrecoAdicional] = useState('');
  const { adicionarAdicional } = useContext(AdicionalContext);

  const salvarAdicional = () => {
    if (nomeAdicional.trim() === '' || precoAdicional.trim() === '') {
      Alert.alert('Erro', 'Preencha o nome e o preço do adicional.');
      return;
    }

    adicionarAdicional({
      nome: nomeAdicional,
      preco: precoAdicional,
    });

    Alert.alert('Sucesso', 'Adicional cadastrado!');
    setNomeAdicional('');
    setPrecoAdicional('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Adicional</Text>

      <TextInput
        placeholder="Nome do adicional"
        style={styles.input}
        value={nomeAdicional}
        onChangeText={setNomeAdicional}
        placeholderTextColor="#A9A9A9"
      />

      <TextInput
        placeholder="Preço do adicional"
        style={styles.input}
        value={precoAdicional}
        onChangeText={setPrecoAdicional}
        keyboardType="numeric"
        placeholderTextColor="#A9A9A9"
      />

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarAdicional}>
        <Text style={styles.textoBotao}>Salvar Adicional</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F6FA' },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D3A87',
    marginBottom: 20,
    textAlign: 'center',
  },
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
