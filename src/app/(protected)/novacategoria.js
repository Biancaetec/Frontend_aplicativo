import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { CategoriaContext } from '../../CategoriaContext';
import { useNavigation } from '@react-navigation/native';

export default function NovaCategoria() {
  const [quantidade, setQuantidade] = useState('');
  const [categoriasTemp, setCategoriasTemp] = useState([]);
  const { adicionarCategorias } = useContext(CategoriaContext);
  const navigation = useNavigation();

  const onQuantidadeChange = (value) => {
    if (value === '' || value === '0') {
      setQuantidade(value);
      return;
    }
    const qtd = parseInt(value);
    const novasCategorias = Array.from({ length: qtd }, () => ({ nome: '' }));
    setCategoriasTemp(prev => [...prev, ...novasCategorias]);
    setQuantidade(value);
  };

  const onNomeChange = (text, i) => {
    const novas = [...categoriasTemp];
    novas[i].nome = text;
    setCategoriasTemp(novas);
  };

  const removerCategoria = (index) => {
    setCategoriasTemp(prev => prev.filter((_, i) => i !== index));
  };

  const salvarCategorias = () => {
    const camposVazios = categoriasTemp.some(cat => cat.nome.trim() === '');
    if (camposVazios) {
      Alert.alert('Erro', 'Preencha todos os nomes das categorias antes de salvar.');
      return;
    }
adicionarCategorias(categoriasTemp);    
Alert.alert('Sucesso', 'Categorias salvas com sucesso!');
    navigation.goBack(); // volta para a tela Categoria
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastro de Categorias</Text>

      <View style={styles.selecaoContainer}>
        <Text style={styles.labelPergunta}>Adicionar categorias</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={quantidade}
            style={styles.picker}
            onValueChange={onQuantidadeChange}
            dropdownIconColor="#0D3A87"
          >
            <Picker.Item label="Não há" value="" />
            <Picker.Item label="0" value="0" />
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
          </Picker>
        </View>
      </View>

      {categoriasTemp.map((item, index) => (
        <View key={index} style={styles.categoriaContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Nome da Categoria</Text>
            <TouchableOpacity onPress={() => removerCategoria(index)}>
              <MaterialIcons name="close" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Ex: Barman"
            style={styles.input}
            value={item.nome}
            onChangeText={(text) => onNomeChange(text, index)}
            placeholderTextColor="#A9A9A9"
          />
        </View>
      ))}

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarCategorias}>
        <Text style={styles.textoBotao}>Salvar Categorias</Text>
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
  selecaoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  labelPergunta: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D3A87',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: '#0D3A87',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    width: 160,
  },
  picker: {
    height: 50,
    color: '#0D3A87',
  },
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
