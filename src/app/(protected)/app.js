import { CategoriaProvider } from '../../CategoriaContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Categoria from './categoria';
import NovaCategoria from './novacategoria';

const Stack = createStackNavigator();

export default function App() {
  return (
    <CategoriaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Categoria" component={Categoria} />
          <Stack.Screen name="NovaCategoria" component={NovaCategoria} />
        </Stack.Navigator>
      </NavigationContainer>
    </CategoriaProvider>
  );
}
