import { createContext, useContext, useEffect, useState } from "react";
import { useUsersDatabase } from "../../database/useUsersDatabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Text, View } from "react-native";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // Estado guarda se autenticado + dados do restaurante
  const [user, setUser] = useState({
    authenticated: false,
    restaurante: null,
  });

  const { authUser } = useUsersDatabase();

  useEffect(() => {
    async function loadStoragedData() {
      try {
        const storagedUser = await AsyncStorage.getItem("@restoon:user");

        if (storagedUser) {
          setUser({
            authenticated: true,
            restaurante: JSON.parse(storagedUser),
          });
        } else {
          setUser({
            authenticated: false,
            restaurante: null,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados armazenados", error);
        setUser({
          authenticated: false,
          restaurante: null,
        });
      }
    }

    loadStoragedData();
  }, []);

  const signIn = async ({ email, password }) => {
    const response = await authUser({ email, password });

    if (!response) {
      setUser({
        authenticated: false,
        restaurante: null,
      });
      throw new Error("Usuário ou senha inválidos.");
    }

    // Salva no AsyncStorage para persistir o login
    await AsyncStorage.setItem("@restoon:user", JSON.stringify(response));

    setUser({
      authenticated: true,
      restaurante: response,
    });
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("@restoon:user");
    setUser({
      authenticated: false,
      restaurante: null,
    });
  };
const login = async (email, senha) => {
  const response = await api.post('/login', { email, senha });
  console.log('🔹 resposta do login:', response.data);
  setUser(response.data);
}
  // Aqui, authenticated pode ser true ou false. 
  // Caso precise de um estado "carregando", ajuste se desejar.

  if (user.authenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 28, marginTop: 15 }}>
          Carregando Dados do Usuário
        </Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
