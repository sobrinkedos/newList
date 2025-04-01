import React, { useState } from 'react';
import { Box, Heading, VStack, FormControl, Input, Button, Text, HStack, Link, Center, useToast } from 'native-base';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleLogin() {
    if (!email || !password) {
      toast.show({
        description: 'Por favor, preencha todos os campos',
        placement: 'top',
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Navegue para a tela principal após login bem-sucedido
      router.replace('/listas');
    } catch (error) {
      toast.show({
        description: error.message || 'Erro ao fazer login',
        placement: 'top',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Center flex={1} px={4}>
      <Box safeArea p={2} py={8} w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="coolGray.800">
          Bem-vindo
        </Heading>
        <Heading mt={1} color="coolGray.600" fontWeight="medium" size="xs">
          Faça login para continuar!
        </Heading>

        <VStack space={3} mt={5}>
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input 
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Senha</FormControl.Label>
            <Input 
              type="password" 
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
          </FormControl>
          <Button 
            mt={2} 
            colorScheme="indigo" 
            onPress={handleLogin}
            isLoading={loading}
            isLoadingText="Entrando"
          >
            Entrar
          </Button>
          <HStack mt={3} justifyContent="center">
            <Text fontSize="sm" color="coolGray.600">
              Não tem uma conta?{" "}
            </Text>
            <Link 
              _text={{ color: "indigo.500", fontWeight: "medium", fontSize: "sm" }}
              onPress={() => router.push('/registro')}
            >
              Cadastre-se
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
}