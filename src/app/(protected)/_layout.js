import React, { useContext, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Platform,
  FlatList,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/Auth/useAuth';
import { useNavigation } from '@react-navigation/native';
import { MesaProvider } from '../../MesaContext';
import { CategoriaProvider } from '../../CategoriaContext';
import { ProdutoProvider } from '../../ProdutoContext';
import { FilaProvider, FilaContext } from '../../FilaContext';

// ================= HEADER CUSTOMIZADO =================
function CustomHeader() {
  const navigation = useNavigation();
  const { filas } = useContext(FilaContext); // pega as filas do contexto
  const [mostrarFilas, setMostrarFilas] = useState(false); // controla dropdown

  // Alterna exibição da lista suspensa de filas
  const handleFilaPress = () => setMostrarFilas(prev => !prev);

  // Seleciona uma fila de preparo
const selecionarFila = (fila) => {
  setMostrarFilas(false);
  navigation.navigate('pedidosdafila', { filaNome: fila.nome }); // usar lowercase do arquivo
};

  return (
    <View style={headerStyles.headerWrapper}>
      {/* Header principal */}
      <View style={headerStyles.headerContainer}>
        {/* Botão de menu */}
        <TouchableOpacity
          style={headerStyles.leftContainer}
          onPress={() => navigation.toggleDrawer()}
        >
          <FontAwesome5 name="bars" size={18} color="#fff" />
          <Text style={headerStyles.headerTitle}>Filtrar</Text>
        </TouchableOpacity>

        {/* Ícones da direita */}
        <View style={headerStyles.rightIcons}>
          {/* Ícone do relógio para abrir dropdown */}
          <TouchableOpacity style={headerStyles.iconButton} onPress={handleFilaPress}>
            <FontAwesome5 name="clock" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown fluido do relógio */}
      {mostrarFilas && (
        <View style={headerStyles.filasDropdown}>
          <Text style={headerStyles.filasTitulo}>Fila de preparo</Text>
          {filas.length === 0 ? (
            <Text style={headerStyles.semFilasTexto}>Cadastre a fila de preparo</Text>
          ) : (
            <FlatList
              data={filas}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={headerStyles.filaItem}
                  onPress={() => selecionarFila(item)}
                >
                  <Text style={headerStyles.filaTexto}>{item.nome}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}

// ================= DRAWER CUSTOMIZADO =================
function CustomDrawerContent(props) {
  const { signOut, user } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      {/* Perfil no topo do Drawer */}
      <View style={styles.areaperfil}>
        <Image style={styles.imagemperfil} />
        <Text style={styles.nomeusuario}>
          {user?.restaurante?.nome || 'Nome do Usuário'}
        </Text>
      </View>

      {/* Lista de Itens do Drawer */}
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Botão Sair */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          signOut();
          router.replace('/');
        }}
      >
        <Text style={{ color: 'white', fontSize: 15 }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

// ================= LAYOUT PRINCIPAL =================
export default function Layout() {
  const { user } = useAuth();

  // Bloqueia acesso se não autenticado
  if (!user?.authenticated) {
    router.replace('/');
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MesaProvider>
        <CategoriaProvider>
          <ProdutoProvider>
            <FilaProvider>
              <Drawer
                screenOptions={{
                  drawerActiveTintColor: '#004aad',
                  drawerInactiveTintColor: '#555',
                  drawerLabelStyle: { fontSize: 16 },
                  drawerStyle: { backgroundColor: '#fff' },
                }}
                drawerContent={(props) => <CustomDrawerContent {...props} />}
              >
                {/* Tela inicial com header customizado */}
                <Drawer.Screen
                  name="home"
                  options={{
                    drawerLabel: 'Início',
                    header: () => <CustomHeader />,
                    drawerIcon: ({ size, color }) => (
                      <FontAwesome5 name="home" size={size} color={color} />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="administracao"
                  options={{
                    drawerLabel: 'Administração',
                    drawerIcon: ({ size, color }) => (
                      <MaterialIcons name="admin-panel-settings" size={size} color={color} />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="pedidosfechados"
                  options={{
                    drawerLabel: 'Pedidos Fechados',
                    drawerIcon: () => <FontAwesome5 name="box" size={20} color="#545454" />,
                  }}
                />
                <Drawer.Screen
                  name="visualizacao"
                  options={{
                    drawerLabel: 'Visualização',
                    drawerIcon: () => <FontAwesome5 name="eye" size={20} color="#545454" />,
                  }}
                />
                {/* Telas ocultas */}
                <Drawer.Screen name="categoria" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="novacategoria" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="editarcategoria" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="mesa" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="novamesa" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="editarmesa" options={{ drawerItemStyle: { display: 'none' } }} />  
                <Drawer.Screen name="produto" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="novoproduto" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="FilaDePreparo" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="novafila" options={{ drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="pedidosdafila" options={{ drawerItemStyle: { display: 'none' } }} />
              </Drawer>
            </FilaProvider>
          </ProdutoProvider>
        </CategoriaProvider>
      </MesaProvider>
    </GestureHandlerRootView>
  );
}

// ================= ESTILOS =================
const headerStyles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    paddingBottom: 5,
    zIndex: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#004aad',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  leftContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '500', marginLeft: 8 },
  rightIcons: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 12 },
  filasDropdown: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 60 : 100,
    right: 20,
    width: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 10,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  filasTitulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  semFilasTexto: { color: '#555', fontStyle: 'italic' },
  filaItem: { padding: 10, backgroundColor: '#fff', borderRadius: 10, marginBottom: 6 },
  filaTexto: { color: '#0D3A87', fontWeight: '500' },
});

const styles = StyleSheet.create({
  areaperfil: {
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#004aad',
    paddingVertical: 90,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imagemperfil: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#fff', marginBottom: 12 },
  nomeusuario: { color: '#fff', fontSize: 18, fontWeight: '600' },
  button: { backgroundColor: '#000', padding: 10, borderRadius: 5, marginTop: 35, alignItems: 'center', width: 200, marginBottom: 20, marginLeft: 35 },
});
