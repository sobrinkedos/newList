import React, { useState, useEffect } from 'react';
import { Box, FlatList, Heading, VStack, HStack, Text, IconButton, Checkbox, Fab, AddIcon, useToast, Input, Modal, FormControl, Button } from 'native-base';
import { supabase } from '../lib/supabase';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Itens() {
  const { listaId, listaNome } = useLocalSearchParams();
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [novoItem, setNovoItem] = useState('');
  const [novoItemQuantidade, setNovoItemQuantidade] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (listaId) {
      fetchItens();
    }
  }, [listaId]);

  async function fetchItens() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('itens')
        .select('*')
        .eq('lista_id', listaId)
        .order('concluido', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setItens(data || []);
    } catch (error) {
      toast.show({
        description: error.message || 'Erro ao carregar itens',
        placement: 'top',
      });
    } finally {
      setLoading(false);
    }
  }

  async function adicionarItem() {
    if (!novoItem.trim()) {
      toast.show({
        description: 'Por favor, insira um nome para o item',
        placement: 'top',
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('itens')
        .insert([
          { 
            nome: novoItem.trim(),
            quantidade: novoItemQuantidade.trim() || '1',
            lista_id: listaId,
            concluido: false,
          },
        ])
        .select();

      if (error) throw error;
      
      // Adicionar o novo item ao estado
      setItens([...itens, data[0]]);
      setNovoItem('');
      setNovoItemQuantidade('');
      setShowModal(false);
      
      toast.show({
        description: 'Item adicionado com sucesso!',
        placement: 'top',
      });
    } catch (error) {
      toast.show({
        description: error.message || 'Erro ao adicionar item',
        placement: 'top',
      });
    }
  }

  async function toggleConcluido(id, concluido) {
    try {
      const { error } = await supabase
        .from('itens')
        .update({ concluido: !concluido })
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar o estado
      setItens(itens.map(item => 
        item.id === id ? { ...item, concluido: !concluido } : item
      ));
    } catch (error) {
      toast.show({
        description: error.message || 'Erro ao atualizar item',
        placement: 'top',
      });
    }
  }

  async function excluirItem(id) {
    try {
      const { error } = await supabase
        .from('itens')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar o estado removendo o item excluído
      setItens(itens.filter(item => item.id !== id));
      
      toast.show({
        description: 'Item excluído com sucesso!',
        placement: 'top',
      });
    } catch (error) {
      toast.show({
        description: error.message || 'Erro ao excluir item',
        placement: 'top',
      });
    }
  }

  return (
    <Box flex={1} safeArea bg="white">
      <VStack space={4} flex={1} p={4}>
        <HStack justifyContent="space-between" alignItems="center">
          <IconButton 
            icon={<Ionicons name="arrow-back" size={24} color="#4f46e5" />} 
            onPress={() => router.back()} 
          />
          <Heading size="md">{listaNome}</Heading>
          <Box w={10} /> {/* Espaço para equilibrar o cabeçalho */}
        </HStack>
        
        {itens.length === 0 && !loading ? (
          <Box flex={1} justifyContent="center" alignItems="center">
            <Text color="gray.500">Esta lista ainda não tem itens</Text>
            <Text color="gray.500">Adicione seu primeiro item!</Text>
          </Box>
        ) : (
          <FlatList
            data={itens}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Box 
                borderBottomWidth={1} 
                borderColor="coolGray.200" 
                py={2}
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <HStack space={2} alignItems="center" flex={1}>
                    <Checkbox 
                      isChecked={item.concluido} 
                      onChange={() => toggleConcluido(item.id, item.concluido)}
                      value={item.id.toString()}
                      accessibilityLabel={`Marcar ${item.nome} como ${item.concluido ? 'não concluído' : 'concluído'}`}
                    />
                    <VStack flex={1}>
                      <Text 
                        fontSize="md" 
                        strikeThrough={item.concluido}
                        color={item.concluido ? "gray.400" : "black"}
                      >
                        {item.nome}
                      </Text>
                      {item.quantidade && (
                        <Text fontSize="xs" color="gray.500">
                          Qtd: {item.quantidade}
                        </Text>
                      )}
                    </VStack>
                  </HStack>
                  <IconButton 
                    icon={<Ionicons name="trash-outline" size={20} color="#ef4444" />} 
                    onPress={() => excluirItem(item.id)} 
                  />
                </HStack>
              </Box>
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
          <Modal.Header>Novo Item</Modal.Header>
          <Modal.Body>
            <FormControl mb={3}>
              <FormControl.Label>Nome do Item</FormControl.Label>
              <Input
                value={novoItem}
                onChangeText={setNovoItem}
                placeholder="Ex: Arroz, Feijão, etc."
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Quantidade</FormControl.Label>
              <Input
                value={novoItemQuantidade}
                onChangeText={setNovoItemQuantidade}
                placeholder="Ex: 1kg, 2 pacotes, etc."
              />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" onPress={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onPress={adicionarItem}>Adicionar</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}