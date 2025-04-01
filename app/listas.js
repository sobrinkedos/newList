import React, { useState, useEffect } from 'react';
import { Box, FlatList, Heading, VStack, HStack, Text, IconButton, AddIcon, Fab, useToast, Input, Modal, FormControl, Button } from 'native-base';
import { Pressable } from 'react-native';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Listas() {
  const [listas, setListas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [novaLista, setNovaLista] = useState('');
  const [user, setUser] = useState(null);
  const toast = useToast();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    checkUser();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user) {
      setUser(data.session.user);
      fetchListas(data.session.user.id);
    } else {
      router.replace('/login');
    }
  }

  async function fetchListas(userId) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listas')
        .select('*')
        .eq('usuario_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListas(data || []);
    } catch (error) {
      toast.show({
        description: error.message || 'Erro ao carregar listas',
        placement: 'top',
      });
    } finally {
      setLoading(false);
    }
  }

  async function criarLista() {
    if (!novaLista.trim()) {
      toast.show({
        description: 'Por favor, insira um nome para a lista',
        placement: 'top',
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('listas')
        .insert([
          { 
            nome: novaLista.trim(),
            usuario_id: user.id,
          },
        ])
        .select();

      if (error) throw error;
      
      // Adicionar a nova lista ao estado
      setListas([data[0], ...listas]);
      setNovaLista('');
      setShowModal(false);
      
      toast.show({
        description: 'Lista criada com sucesso!',
        placement: 'top',
      });
    } catch (error) {
      toast.show({
        description: error.message || 'Erro ao criar lista',
        placement: 'top',
      });
    }
  }

  async function excluirLista(id) {
    try {
      const { error } = await supabase
        .from('listas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar o estado removendo a lista excluída
      setListas(listas.filter(lista => lista.id !== id));
      
      toast.show({
        description: 'Lista excluída com sucesso!',
        placement: 'top',
      });
    } catch (error) {
      toast.show({
        description: error.message || 'Erro ao excluir lista',
        placement: 'top',
      });
    }
  }

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/login');
    } catch (error) {
      toast.show({
        description: error.message || 'Erro ao fazer logout',
        placement: 'top',
      });
    }
  }

  function abrirLista(lista) {
    router.push({
      pathname: '/itens',
      params: { listaId: lista.id, listaNome: lista.nome }
    });
  }

  return (
    <Box flex={1} safeArea bg="white">
      <VStack space={4} flex={1} p={4}>
        <HStack justifyContent="space-between" alignItems="center">
          <Heading size="lg">Minhas Listas</Heading>
          <IconButton 
            icon={<Ionicons name="log-out-outline" size={24} color="#4f46e5" />} 
            onPress={handleLogout} 
          />
        </HStack>
        
        {listas.length === 0 && !loading ? (
          <Box flex={1} justifyContent="center" alignItems="center">
            <Text color="gray.500">Você ainda não tem listas de compras</Text>
            <Text color="gray.500">Crie sua primeira lista!</Text>
          </Box>
        ) : (
          <FlatList
            data={listas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable onPress={() => abrirLista(item)}>
                <Box 
                  borderBottomWidth={1} 
                  borderColor="coolGray.200" 
                  py={2}
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <VStack>
                      <Text fontSize="md" bold>{item.nome}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      </Text>
                    </VStack>
                    <IconButton 
                      icon={<Ionicons name="trash-outline" size={20} color="#ef4444" />} 
                      onPress={() => excluirLista(item.id)} 
                    />
                  </HStack>
                </Box>
              </Pressable>
            )}
          />
        )}
      </VStack>

      <Fab 
        position="absolute"
        size="sm"
        icon={<AddIcon size="sm" />}
        onPress={() => setShowModal(true)}
        colorScheme="indigo"
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Nova Lista de Compras</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Nome da Lista</FormControl.Label>
              <Input
                value={novaLista}
                onChangeText={setNovaLista}
                placeholder="Ex: Supermercado, Feira, etc."
              />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" onPress={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onPress={criarLista}>Criar</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}