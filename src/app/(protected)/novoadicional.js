import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function NovoAdicional() {
  const navigation = useNavigation();
  const [quantidade, setQuantidade] = useState('0');
  const [adicionais, setAdicionais] = useState([]);

  // Adiciona campos acumulativos
  const adicionarCampos = (value) => {
    const qtd = parseInt(value);
    if (!isNaN(qtd) && qtd > 0) {
      const novos = Array.from({ length: qtd }, () => ({ nome: '', preco: '' }));
      setAdicionais((prev) => [...prev, ...novos]);
    }
    setQuantidade(value);
  };

  // Atualiza campos
  const atualizarCampo = (index, campo, valor) => {
    const novos = [...adicionais];
    if (campo === 'preco') {
      const numeroLimpo = valor.replace(/\D/g, '');
      const valorFormatado =
        numeroLimpo.length > 0
          ? (parseInt(numeroLimpo) / 100).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })
          : '';
      novos[index][campo] = valorFormatado;
    } else {
      novos[index][campo] = valor;
    }
    setAdicionais(novos);
  };

  // Remove adicional
  const removerCampo = (index) => {
    setAdicionais((prev) => prev.filter((_, i) => i !== index));
  };

  // Salvar adicionais e voltar
  const salvarAdicionais = () => {
    navigation.navigate('adicional', { listaAdicionais: adicionais });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastro de Adicionais</Text>

      <View style={styles.pickerWrapper}>
        <Text style={styles.labelPergunta}>Adicionar quantos?</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={quantidade}
            onValueChange={adicionarCampos}
            style={styles.picker}
            dropdownIconColor="#0D3A87"
          >
            <Picker.Item label="Selecione" value="0" />
            {[1, 2, 3, 4, 5].map((num) => (
              <Picker.Item key={num} label={`${num}`} value={`${num}`} />
            ))}
          </Picker>
        </View>
      </View>

      {adicionais.map((item, index) => (
        <View key={index} style={styles.categoriaContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Nome do adicional</Text>
            <TouchableOpacity onPress={() => removerCampo(index)}>
              <FontAwesome name="trash" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Ex: Extra queijo"
            style={styles.input}
            value={item.nome}
            onChangeText={(text) => atualizarCampo(index, 'nome', text)}
            placeholderTextColor="#A9A9A9"
          />
          <TextInput
            placeholder="Preço"
            style={styles.input}
            keyboardType="numeric"
            value={item.preco}
            onChangeText={(text) => atualizarCampo(index, 'preco', text)}
            placeholderTextColor="#A9A9A9"
          />
        </View>
      ))}

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarAdicionais}>
        <Text style={styles.textoBotao}>Salvar Adicionais</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F6FA',
    flexGrow: 1,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 22,
    color: '#0D3A87',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  pickerWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  labelPergunta: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D3A87',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: '#0D3A87',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    width: 160,
  },
  picker: { height: 50, color: '#0D3A87' },
  categoriaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    color: '#0D3A87',
    fontSize: 15,
  },
  input: {
    height: 45,
    borderWidth: 1.5,
    borderColor: '#0D3A87',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9F9F9',
    color: '#333',
    fontSize: 15,
    marginBottom: 10,
  },
  botaoSalvar: {
    backgroundColor: '#0D3A87',
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 30,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
