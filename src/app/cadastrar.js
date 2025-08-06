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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Cadastrar() {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // SEM barra no final
  const BASE_URL = 'https://turbo-guide-v6pprpwwjpjjh6gwx-3001.app.github.dev/';

  const handleCadastrar = async () => {
    if (!email.trim() || !nome.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Alert.alert('Aviso', 'Preencha todos os campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Aviso', 'As senhas não coincidem.');
      return;
    }
const id_usuario = 1; // ou pega do contexto de autenticação
const status_licenciamento = "pendente"; // valor padrão para novos restaurantes

    setLoading(true);
    try {
      const url = `${BASE_URL}/api/restaurante`;
      console.log('Enviando para:', url);
      console.log('Payload:', { nome, email, senha, id_usuario, status_licenciamento });

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, id_usuario, status_licenciamento }),
      });

      console.log('Status da resposta:', response.status);

      // Ler o content-type antes de chamar response.json()
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Resposta JSON:', data);

        if (response.ok) {
          Alert.alert('Sucesso', data.message || 'Cadastro realizado com sucesso.');
          setEmail('');
          setNome('');
          setSenha('');
          setConfirmarSenha('');
        } else {
          Alert.alert('Erro', data.message || 'Não foi possível realizar o cadastro.');
        }
      } else {
        // Resposta não-JSON (provavelmente HTML de erro). Lê o texto bruto para debugar.
        const text = await response.text();
        console.warn('Resposta não é JSON. Body bruto:', text);
        Alert.alert(
          'Erro',
          `Resposta inesperada do servidor (não JSON). Código: ${response.status}`
        );
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      // Mostra mensagem mais útil ao usuário
      Alert.alert('Erro', 'Falha ao conectar com o servidor. Verifique a rede e a URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.formulariocaixa}>
          <Text style={[styles.titulo, { marginTop: 20 }]}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="restoon@gmail.com"
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#888"
            autoCapitalize="none"
          />

          <Text style={styles.titulo}>Nome</Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
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
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
              <Ionicons name={mostrarSenha ? 'eye-outline' : 'eye-off-outline'} size={24} color="#555" />
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
            autoCapitalize="none"
          />

          <Text style={styles.aviso}>
            Ao se cadastrar, você concorda com nossos{' '}
            <Text style={{ color: '#004aad' }}>Termos de Uso</Text> e{' '}
            <Text style={{ color: '#004aad' }}>Política de Privacidade</Text>.
          </Text>

          <TouchableOpacity
            style={[styles.botao, loading && { opacity: 0.7 }]}
            onPress={handleCadastrar}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.textobotao}>Cadastre-se</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
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
  titulo: { fontSize: 14, marginBottom: 8, color: '#000' },
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
  caixa: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#000' },
  aviso: { fontSize: 15, color: '#555', marginTop: 18, marginBottom: 10 },
  botao: {
    backgroundColor: '#004aad',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  textobotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
