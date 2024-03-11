import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native';
import SignInWithOAuth from '@/components/sign-in-oath';
import * as SecureStore from 'expo-secure-store';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}


const CLERK_PUBLISHABLE_KEY =
	'SOMETHING_LIKE_sk_test_4eC39HqLyjWDarjtT1zdp7dc';
  
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const tokenCache = {
		async getToken(key: string) {
			try {
				return SecureStore.getItemAsync(key);
			} catch (err) {
				return null;
			}
		},
		async saveToken(key: string, value: string) {
			try {
				return SecureStore.setItemAsync(key, value);
			} catch (err) {
				return;
			}
		},
	};

  return (
    <ClerkProvider
			publishableKey={CLERK_PUBLISHABLE_KEY}
			tokenCache={tokenCache}
		>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<SignedIn>
					<Stack>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen name="modal" options={{ presentation: 'modal' }} />
					</Stack>
				</SignedIn>
				<SignedOut>
					<SafeAreaView>
						<SignInWithOAuth />
					</SafeAreaView>
				</SignedOut>
			</ThemeProvider>
		</ClerkProvider>
  );
}
