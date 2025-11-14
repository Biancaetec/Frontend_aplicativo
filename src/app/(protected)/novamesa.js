import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MesaContext } from '../../MesaContext';
import { useNavigation } from '@react-navigation/native';
import BotaoVoltar from '../(protected)/botaovoltar';

export default function NovaMesa() {
  const { adicionarMesa, loading, id_restaurante } = useContext(MesaContext);
  const navigation = useNavigation();

  const [numero, setNumero] = useState('');
  const [mensagemVisivel, setMensagemVisivel] = useState(false);

  const handleSalvar = async () => {
    if (!id_restaurante) {
      Alert.alert('Erro', 'Usuário não autenticado. Aguarde carregar a sessão.');
      return;
    }

    if (!numero.trim() || isNaN(Number(numero))) {
      Alert.alert('Erro', 'Informe um número válido para a mesa.');
      return;
    }

    try {
      console.log('🔹 Tentando adicionar mesa:', { numero, id_restaurante });
      await adicionarMesa(Number(numero));
      setMensagemVisivel(true);
      setNumero('');
    } catch (error) {
      console.error('Erro ao salvar mesa:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a mesa.');
    }
  };

  return (
    <View style={styles.container}>
      <BotaoVoltar destino="mesa" />
      <Text style={styles.titulo}>Cadastro de Mesa</Text>

      <TextInput
        placeholder="Número da mesa"
        style={styles.input}
        value={numero}
        onChangeText={setNumero}
        keyboardType="numeric"
        placeholderTextColor="#A9A9A9"
      />

      <TouchableOpacity
        style={[styles.botaoSalvar, (loading || !id_restaurante) && { opacity: 0.7 }]}
        onPress={handleSalvar}
        disabled={loading || !id_restaurante}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>Salvar Mesa</Text>
        )}
      </TouchableOpacity>

      {mensagemVisivel && (
        <TouchableOpacity
          style={styles.mensagemContainer}
          onPress={() => navigation.navigate('mesa')}
        >
          <Text style={styles.mensagemTexto}>
            Visualizar informação cadastrada
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F6FA', justifyContent: 'flex-start' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#0D3A87', marginBottom: 25, textAlign: 'center' },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#0D3A87',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 25,
    color: '#333',
    fontSize: 16,
  },
  botaoSalvar: { backgroundColor: '#0D3A87', paddingVertical: 15, borderRadius: 15, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  mensagemContainer: { marginTop: 20, padding: 12, borderRadius: 10, alignItems: 'center', backgroundColor: '#E8F0FF' },
  mensagemTexto: { color: '#0D3A87', fontWeight: 'bold', fontSize: 15 },
});
