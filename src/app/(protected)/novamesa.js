import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { MesaContext } from '../../MesaContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function NovaMesa() {
  const { adicionarMesa, editarMesa, loading } = useContext(MesaContext);
  const navigation = useNavigation();
  const route = useRoute(); // pega os params da rota

  const mesaEditando = route.params?.mesaEditando || null; // aqui você pega os params passados
  const [numero, setNumero] = useState('');

  useEffect(() => {
    if (mesaEditando) setNumero(mesaEditando.numero.toString());
  }, [mesaEditando]);

  const handleSalvar = async () => {
    if (!numero.trim()) {
      Alert.alert('Erro', 'Informe o número da mesa.');
      return;
    }

    if (mesaEditando) {
      await editarMesa(mesaEditando.id_mesa, numero, mesaEditando.ocupada);
    } else {
      await adicionarMesa(numero);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Número da Mesa</Text>
      <TextInput
        style={styles.input}
        value={numero}
        onChangeText={setNumero}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.botao} onPress={handleSalvar} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Salvar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20 },
  botao: { backgroundColor: '#004aad', padding: 15, borderRadius: 10, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
