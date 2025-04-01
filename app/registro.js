import React, { useState } from 'react';
import { Box, Heading, VStack, FormControl, Input, Button, Text, HStack, Link, Center, useToast } from 'native-base';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

export default function Registro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleRegistro() {
    if (!nome || !email || !password || !confirmPassword) {
      toast.show({
        description: 'Por favor, preencha todos os campos',
        placement: 'top',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.show({
        description: 'As senhas não coincidem',
        placement: 'top',
      });
      return;
    }

    setLoading(true);
    
    try {
      // Registrar o usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome,
          },
        },
      });

      if (error) throw error;
      
      toast.show({
        description: 'Registro realizado com sucesso! Verifique seu email para confirmar.',
        placement: 'top',
      });
      
      // Voltar para a tela de login
      router.replace('/login');
    } catch (error) {
      toast.show({
        description: error.message || 'Erro ao fazer registro',
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
          Criar Conta
        </Heading>
        <Heading mt={1} color="coolGray.600" fontWeight="medium" size="xs">
          Cadastre-se para começar!
        </Heading>

        <VStack space={3} mt={5}>
          <FormControl>
            <FormControl.Label>Nome</FormControl.Label>
            <Input 
              value={nome}
              onChangeText={setNome}
            />
          </FormControl>
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
          <FormControl>
            <FormControl.Label>Confirmar Senha</FormControl.Label>
            <Input 
              type="password" 
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />
          </FormControl>
          <Button 
            mt={2} 
            colorScheme="indigo" 
            onPress={handleRegistro}
            isLoading={loading}
            isLoadingText="Registrando"
          >
            Cadastrar
          </Button>
          <HStack mt={3} justifyContent="center">
            <Text fontSize="sm" color="coolGray.600">
              Já tem uma conta?{" "}
            </Text>
            <Link 
              _text={{ color: "indigo.500", fontWeight: "medium", fontSize: "sm" }}
              onPress={() => router.push('/login')}
            >
              Faça login
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
}