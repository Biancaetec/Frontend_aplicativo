import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function NovoAdicional({ route }) {
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

  // Salvar adicionais e voltar para Adicional.js
  const salvarAdicionais = () => {
    navigation.navigate('adicional', { listaAdicionais: adicionais });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Adicionais</Text>

      <View style={styles.pickerWrapper}>
        <Text style={styles.label}>Adicionar quantos?</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={quantidade}
            onValueChange={adicionarCampos}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Selecione" value="0" color="#004aad" />
            {[1, 2, 3, 4, 5].map((num) => (
              <Picker.Item key={num} label={`${num}`} value={`${num}`} color="#004aad" />
            ))}
          </Picker>
        </View>
      </View>

      <ScrollView style={styles.scroll}>
        {adicionais.map((item, index) => (
          <View key={index} style={styles.campoContainer}>
            <TextInput
              placeholder="Nome do adicional"
              style={styles.input}
              value={item.nome}
              onChangeText={(valor) => atualizarCampo(index, 'nome', valor)}
              placeholderTextColor="#666"
            />
            <TextInput
              placeholder="Preço"
              style={styles.input}
              keyboardType="numeric"
              value={item.preco}
              onChangeText={(valor) => atualizarCampo(index, 'preco', valor)}
              placeholderTextColor="#666"
            />
            <TouchableOpacity onPress={() => removerCampo(index)} style={styles.botaoExcluir}>
              <FontAwesome name="trash" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarAdicionais}>
        <Text style={styles.textoBotao}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#004aad', textAlign: 'center', marginBottom: 16 },
  pickerWrapper: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', color: '#004aad', marginBottom: 4 },
  pickerContainer: { backgroundColor: '#a9c2e2ff', borderRadius: 10 },
  picker: { color: '#fff' },
  scroll: { flex: 1, marginVertical: 8 },
  campoContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ddd', padding: 8, borderRadius: 8, marginBottom: 8 },
  input: { flex: 1, height: 40, borderColor: '#004aad', borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, marginRight: 6, color: '#004aad' },
  botaoExcluir: { backgroundColor: '#ff1c1c', padding: 8, borderRadius: 6 },
  botaoSalvar: { backgroundColor: '#004aad', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
