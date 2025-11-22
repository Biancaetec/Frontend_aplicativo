import React, { useContext, useEffect, useState } from 'react';
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
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/Auth/useAuth';
import { useNavigation } from '@react-navigation/native';
import { MesaProvider } from '../../MesaContext';
import { CategoriaContext, CategoriaProvider } from '../../CategoriaContext';
import { ProdutoProvider } from '../../ProdutoContext';
import { FilaProvider, FilaContext } from '../../FilaContext';
import { PedidoProvider } from '../../PedidoContext';

// ================= HEADER CUSTOMIZADO =================
function CustomHeader() {
  const navigation = useNavigation();
  const { filas } = useContext(FilaContext);
  const [mostrarFilas, setMostrarFilas] = useState(false);
  const { categorias } = useContext(CategoriaContext);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');

  const handleFilaPress = () => setMostrarFilas(prev => !prev);

  // Função para selecionar a fila e navegar
  const selecionarFila = (cat) => {
    setMostrarFilas(false); // Fecha o dropdown de categorias
    // Chama a função para carregar a fila de preparo da categoria
    getFilaPreparoPorCategoria(cat.id_categoria).then(fila => {
      // Navega para a tela 'pedidosdafila' passando a fila e a categoria
      navigation.navigate('pedidosdafila', { fila: fila, categoria: cat });
    });
  };



  return (
    <View style={headerStyles.headerWrapper}>
      <View style={headerStyles.headerContainer}>
        <TouchableOpacity
          style={headerStyles.leftContainer}
          onPress={() => navigation.toggleDrawer()}
        >
          <View style={headerStyles.iconWithLabel}>
            <MaterialIcons name="menu" size={40} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={headerStyles.rightIcons}>
          <TouchableOpacity style={headerStyles.iconButton} onPress={() => router.push('/pedidosdafila')}>
            <View style={headerStyles.iconWithLabel}>
              <MaterialIcons name="access-time-filled" size={30} color="#fff" />
              <Text style={headerStyles.iconLabel}>Fila de Preparo</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/** 
      {mostrarFilas && (
        <View style={headerStyles.filasDropdown}>
          <Text style={headerStyles.filasTitulo}>Fila de preparo</Text>
          {categorias && categorias.length > 0 ? (
            <View>
              {categorias.map((cat, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setCategoriaSelecionada(cat.nome);
                    selecionarFila(cat); // Chama a função para selecionar a fila da categoria
                  }}
                >
                  <Text>{cat.nome}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
              <Text>Nenhuma categoria cadastrada</Text>
              <TouchableOpacity
                style={{ marginLeft: 10, backgroundColor: '#004aad', padding: 5, borderRadius: 5 }}
                onPress={() => router.push('/categoria')}
              >
                <Text style={{ color: '#fff' }}>Cadastrar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}*/}

    </View>
  );
}

// ================= DRAWER CUSTOMIZADO =================
function CustomDrawerContent(props) {
  const { signOut, user } = useAuth();

  return (
    <View style={styles.drawerWrapper}>
      <View style={styles.areaperfil}>
        <Image style={styles.imagemperfil} />
        <Text style={styles.nomeusuario}>
          {user?.restaurante?.nome || 'Nome do Usuário'}
        </Text>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
        <DrawerItemList {...props} itemStyle={styles.drawerItem} labelStyle={styles.drawerLabel} />
      </DrawerContentScrollView>

      <TouchableOpacity
        style={styles.buttonDrawer}
        onPress={() => {
          signOut();
          router.replace('/');
        }}
      >
        <Text style={styles.buttonDrawerText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

// ================= LAYOUT PRINCIPAL =================
export default function Layout() {
  const { user } = useAuth();

  if (!user?.authenticated) {
    router.replace('/');
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <MesaProvider>
          <CategoriaProvider>
            <ProdutoProvider>
              <PedidoProvider>
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
                    <Drawer.Screen
                      name="home"
                      options={{
                        drawerLabel: 'Início',
                        header: () => <CustomHeader />,
                        drawerIcon: ({ size, color }) => (
                          <MaterialIcons name="home" size={size} color={color} />
                        ),
                      }}
                    />
                    <Drawer.Screen
                      name="mesa"
                      options={{
                        drawerLabel: 'Gestão de Mesas',
                        drawerIcon: ({ size, color }) => (
                          <MaterialIcons name="table-bar" size={size} color={color} />
                        ),
                      }}
                    />
                    <Drawer.Screen
                      name="categoria"
                      options={{
                        drawerLabel: 'Gestão de Categorias',
                        drawerIcon: ({ size, color }) => (
                          <MaterialIcons name="category" size={size} color={color} />
                        ),
                      }}
                    />
                    <Drawer.Screen
                      name="produto"
                      options={{
                        drawerLabel: 'Gestão de Produtos',
                        drawerIcon: ({ size, color }) => (
                          <MaterialIcons name="shopping-cart" size={size} color={color} />
                        ),
                      }}
                    />
                    <Drawer.Screen
                      name="pedidosfechados"
                      options={{
                        drawerLabel: 'Pedidos Fechados',
                        drawerIcon: () => <MaterialIcons name="check-box" size={20} color="#545454" />,
                      }}
                    />
                    <Drawer.Screen
                      name="visualizacao"
                      options={{
                        drawerLabel: 'Visualização',
                        drawerIcon: () =>
                          <MaterialIcons name="view-comfy" size={20} color="#545454" />,
                      }}
                    />

                    {/* Telas ocultas */}
                    <Drawer.Screen name="novacategoria" options={{ drawerItemStyle: { display: 'none' } }} />
                    <Drawer.Screen name="visualizarcategorias" options={{ drawerItemStyle: { display: 'none' } }} />
                    <Drawer.Screen name="editarcategoria" options={{ drawerItemStyle: { display: 'none' } }} />
                    <Drawer.Screen name="novamesa" options={{ drawerItemStyle: { display: 'none' } }} />
                    <Drawer.Screen name="editarmesa" options={{ drawerItemStyle: { display: 'none' } }} />
                    <Drawer.Screen name="novoproduto" options={{ drawerItemStyle: { display: 'none' } }} />
                    <Drawer.Screen name="editarproduto" options={{ drawerItemStyle: { display: 'none' } }} />
                    <Drawer.Screen name="FilaDePreparo" options={{ drawerItemStyle: { display: 'none' } }} />
                    <Drawer.Screen name="novafila" options={{ drawerItemStyle: { display: 'none' } }} />
                    <Drawer.Screen name="pedidosdafila" options={{ drawerItemStyle: { display: 'none' } }} />
                    <Drawer.Screen name="revisarpedido" options={{ drawerItemStyle: { display: 'none' } }} />
                    <Drawer.Screen name="visualizarmesa" options={{ drawerItemStyle: { display: 'none' } }} />
                    <Drawer.Screen name="administracao" options={{ drawerItemStyle: { display: 'none' } }} />
                    <Drawer.Screen name="botaovoltar" options={{ drawerItemStyle: { display: 'none' } }} />
                  </Drawer>
                </FilaProvider>
              </PedidoProvider>
            </ProdutoProvider>
          </CategoriaProvider>
        </MesaProvider>
    </GestureHandlerRootView>
  );
}

// ================= ESTILOS =================
const headerStyles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#004aad',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 38 : 48,
    paddingBottom: 8,
    zIndex: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: Platform.OS === 'android' ? 34 : 36,
  },
  leftContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginLeft: 10 },
  rightIcons: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 12 },
  iconWithLabel: { alignItems: 'center', justifyContent: 'center' },
  iconLabel: { color: '#fff', fontSize: 12, marginTop: 4, fontWeight: '600' },
  filasDropdown: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 110 : 150,
    right: 12,
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    maxHeight: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 100,
  },
  filasTitulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
});

const styles = StyleSheet.create({
  drawerWrapper: {
    flex: 1,
    backgroundColor: '#f4f7fb',
    // Gradiente fake usando cor sólida, para gradiente real use expo-linear-gradient
  },
  areaperfil: {
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#004aad',
    paddingVertical: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  imagemperfil: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 10,
    backgroundColor: '#e0e7ef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
  nomeusuario: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.5,
    textShadowColor: '#003366',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  drawerScroll: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  drawerItem: {
    borderRadius: 12,
    marginVertical: 2,
    marginHorizontal: 8,
    backgroundColor: '#e0e7ef',
    elevation: 1,
  },
  drawerLabel: {
    fontSize: 17,
    color: '#004aad',
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonDrawer: {
    backgroundColor: '#004aad',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonDrawerText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
