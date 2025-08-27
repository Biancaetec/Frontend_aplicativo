import React, { useState, useContext } from 'react'; 
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MesaContext } from '../../MesaContext';

export default function NovaMesa() {
  const [numeroMesa, setNumeroMesa] = useState('');
  const { adicionarMesa } = useContext(MesaContext);

  const salvarMesa = () => {
    if (numeroMesa.trim() === '') {
      Alert.alert('Erro', 'Digite o número da mesa.');
      return;
    }
    adicionarMesa({ numero: numeroMesa });
    Alert.alert('Sucesso', 'Mesa cadastrada!');
    setNumeroMesa(''); // limpa o input para novo cadastro
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Mesa</Text>

      <TextInput
        placeholder="Número da mesa"
        style={styles.input}
        value={numeroMesa}
        onChangeText={setNumeroMesa}
        keyboardType="numeric"
        placeholderTextColor="#A9A9A9"
      />

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarMesa}>
        <Text style={styles.textoBotao}>Salvar Mesa</Text>
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
