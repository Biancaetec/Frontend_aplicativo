import React, { useState, useContext, useEffect } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import BotaoVoltar from '../(protected)/botaovoltar';

export default function EditarMesa() {
  const { editarMesa, loading, id_restaurante } = useContext(MesaContext);
  const navigation = useNavigation();
  const route = useRoute();

  // Recebe a mesa que será editada
  const mesaEditando = route.params?.mesaEditando || null;

  const [numero, setNumero] = useState('');

  useEffect(() => {
    if (mesaEditando) {
      setNumero(mesaEditando.numero.toString());
    }
  }, [mesaEditando]);

  const handleSalvar = async () => {
    if (!mesaEditando) {
      Alert.alert('Erro', 'Nenhuma mesa selecionada para edição.');
      return;
    }

    if (!numero.trim() || isNaN(Number(numero))) {
      Alert.alert('Erro', 'Informe um número válido para a mesa.');
      return;
    }

    if (!id_restaurante) {
      Alert.alert('Erro', 'Usuário não autenticado. Aguarde carregar a sessão.');
      return;
    }

    try {
      console.log('🔹 Tentando editar mesa:', {
        id_mesa: mesaEditando.id_mesa,
        numero,
        id_restaurante,
      });

      await editarMesa(mesaEditando.id_mesa, Number(numero));
      Alert.alert('Sucesso', 'Mesa atualizada com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao atualizar mesa:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar a mesa.');
    }
  };

  return (
    <View style={styles.container}>
      <BotaoVoltar destino="mesa" />
      <Text style={styles.titulo}>Editar Mesa</Text>

      <TextInput
        placeholder="Número da mesa"
        style={styles.input}
        value={numero}
        onChangeText={setNumero}
        keyboardType="numeric"
        placeholderTextColor="#A9A9A9"
      />

      <TouchableOpacity
        style={[styles.botaoSalvar, loading && { opacity: 0.7 }]}
        onPress={handleSalvar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F6FA',
    justifyContent: 'flex-start',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D3A87',
    marginBottom: 25,
    textAlign: 'center',
  },
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
  botaoSalvar: {
    backgroundColor: '#0D3A87',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
