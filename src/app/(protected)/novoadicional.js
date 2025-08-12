import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function novoadicional() {
  const [quantidade, setQuantidade] = useState('0');
  const [adicionais, setAdicionais] = useState([]);

  const onQuantidadeChange = (value) => {
    setQuantidade(value);
    const qtd = parseInt(value);

    const novosAdicionais = [];
    for (let i = 0; i < qtd; i++) {
      novosAdicionais.push({ nome: '', preco: '', custo: '' });
    }
    setAdicionais(novosAdicionais);
  };

  const onNomeChange = (text, i) => {
    const novos = [...adicionais];
    novos[i].nome = text;
    setAdicionais(novos);
  };

  const onPrecoChange = (text, i) => {
    const novos = [...adicionais];
    novos[i].preco = text;
    setAdicionais(novos);
  };

  const onCustoChange = (text, i) => {
    const novos = [...adicionais];
    novos[i].custo = text;
    setAdicionais(novos);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.texto}>Página de criação de novo adicional</Text>

      <Text style={{ marginTop: 20, marginBottom: 8, fontWeight: 'bold', color: '#0D3A87' }}>
        Quantos adicionais deseja adicionar?
      </Text>

      <Picker
        selectedValue={quantidade}
        style={styles.picker}
        onValueChange={onQuantidadeChange}
        dropdownIconColor="#0D3A87"
      >
        <Picker.Item label="0" value="0" />
        <Picker.Item label="1" value="1" />
        <Picker.Item label="2" value="2" />
        <Picker.Item label="3" value="3" />
        <Picker.Item label="4" value="4" />
      </Picker>

      {adicionais.map((item, index) => (
        <View key={index} style={styles.adicionalContainer}>
          {/* Campo Nome */}
          <Text style={styles.label}>Nome</Text>
         <TextInput
  placeholder="Exemplos:"
  style={styles.input}
  value={item.nome}
  onChangeText={(text) => onNomeChange(text, index)}
  placeholderTextColor="#A9A9A9"
/>

          {/* Campo Preço e Custo lado a lado */}
          <View style={styles.precoCustoContainer}>
            <View style={styles.precoCustoBox}>
              <Text style={styles.label}>Preço</Text>
              <TextInput
                placeholder="R$"
                style={styles.input}
                value={item.preco}
                onChangeText={(text) => onPrecoChange(text, index)}
                keyboardType="numeric"
                placeholderTextColor="#A9A9A9"
              />
            </View>

            <View style={styles.precoCustoBox}>
              <Text style={styles.label}>Custo</Text>
              <TextInput
                placeholder="R$"
                style={styles.input}
                value={item.custo}
                onChangeText={(text) => onCustoChange(text, index)}
                keyboardType="numeric"
                placeholderTextColor="#A9A9A9"
              />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#EDEDED',
    flexGrow: 1,
  },
  texto: {
    fontSize: 18,
    color: '#0D3A87',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: 150,
    borderWidth: 1,
    borderColor: '#0D3A87',
    borderRadius: 10,
    color: '#0D3A87',
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
  adicionalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 20,
  },
  label: {
    fontWeight: '600',
    color: '#0D3A87',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderWidth: 1.8,
    borderColor: '#0D3A87',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    color: '#333',
  },
  precoCustoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  precoCustoBox: {
    flex: 1,
    marginHorizontal: 5,
  },
});