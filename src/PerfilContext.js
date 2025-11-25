import { createContext, useState, useEffect } from 'react';

export const PerfilContext = createContext();

export function PerfilProvider({ children }) {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulação de dados do perfil
  const dadosSimulados = {
    nome: 'Restaurante Exemplo',
    email: 'contato@restaurante.com',
    telefone: '(11) 99999-9999',
    imagem: '', // pode colocar URL de imagem para testar
  };

  // Simula carregamento de dados
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setPerfil(dadosSimulados);
      setLoading(false);
    }, 1000); // 1s de "carregamento"
    return () => clearTimeout(timer);
  }, []);

  // Função visual de editar perfil (não salva nada)
  const editarPerfil = async (dadosAtualizados) => {
    setLoading(true);
    setTimeout(() => {
      setPerfil({ ...perfil, ...dadosAtualizados });
      setLoading(false);
      alert('Perfil atualizado visualmente!');
    }, 500);
  };

  return (
    <PerfilContext.Provider value={{ perfil, editarPerfil, loading }}>
      {children}
    </PerfilContext.Provider>
  );
}
