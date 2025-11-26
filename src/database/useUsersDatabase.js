import { useCallback } from "react";

export function useUsersDatabase() {
  const authUser = useCallback(async ({ email, password }) => {
    //const url = "https://special-invention-9769xr99qw56hx95x-3001.app.github.dev/api/login";
    const url = "https://backend-restoon.onrender.com/";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha: password }), // 'senha' é o campo esperado pelo backend
      });

      if (!response.ok) {
        console.log(`Falha no login, status: ${response.status}`);
        return null;
      }

      const data = await response.json();

      console.log("🔹 Dados recebidos do servidor:", data);

      // Remove a senha antes de retornar
      const { senha, ...userData } = data;

      return userData;
    } catch (error) {
      console.error("Erro ao autenticar usuário:", error);
      return null;
    }
  }, []);

  return {
    authUser,
  };
}
