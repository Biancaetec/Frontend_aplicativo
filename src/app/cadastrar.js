import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Cadastrar() {
  const [email, setEmail] = useState('');
  const [nome, setName] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [confirmarSenha, setConfirmarSenha] = useState('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // ajuste se precisar
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formulariocaixa}>

          <Text style={[styles.titulo, { marginTop: 20 }]}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="restoon@gmail.com"
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#888"
          />

          <Text style={styles.titulo}>Nome</Text>
          <TextInput
            value={nome}
            onChangeText={setName}
            placeholder="Seu nome completo"
            style={styles.input}
            placeholderTextColor="#888"
          />

          <Text style={styles.titulo}>Senha</Text>
          <View style={styles.senha}>
            <TextInput
              value={senha}
              onChangeText={setSenha}
              placeholder="Senha"
              secureTextEntry={!mostrarSenha}
              style={styles.caixa}
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
              <Ionicons
                name={mostrarSenha ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.titulo}>Confirme sua senha</Text>
          <TextInput
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            placeholder="Confirme sua senha"
            secureTextEntry={!mostrarSenha}
            style={styles.input}
            placeholderTextColor="#888"
          />

          <Text style={styles.aviso}>
            Ao se cadastrar, você concorda com nossos{' '}
            <Text style={{ color: '#004aad' }}>Termos de Uso</Text> e{' '}
            <Text style={{ color: '#004aad' }}>Política de Privacidade</Text>.
          </Text>

          <TouchableOpacity style={styles.botao}>
            <Text style={styles.textobotao}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  formulariocaixa: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '88%',
    padding: 12,
    elevation: 20,
    alignSelf: 'center',
    marginTop: 70,
    marginBottom: 30,
  },
  titulo: {
    fontSize: 14,
    marginBottom: 8,
    color: '#000',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 25,
    fontSize: 14,
    color: '#000',
  },
  senha: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 25,
  },
  caixa: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
  },
  aviso: {
    fontSize: 15,
    color: '#555',
    marginTop: 18,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: '#004aad',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  textobotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
