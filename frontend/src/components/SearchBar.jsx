// src/components/SearchBar.jsx

import React from 'react';
// Vamos usar componentes do Chakra para fazer a barra de busca
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
// E um ícone
import { SearchIcon } from '@chakra-ui/icons';

// Recebe a função 'onSearchChange' (que é o 'setQuery' da HomePage) como propriedade
function SearchBar({ onSearchChange }) {
  
  const handleChange = (event) => {
    // A cada tecla digitada, informa a HomePage do novo valor
    onSearchChange(event.target.value);
  };

  return (
    <InputGroup size="lg" maxW="800px" mx="auto">
      <InputLeftElement
        pointerEvents="none"
        children={<SearchIcon color="gray.400" />}
      />
      <Input
        type="text"
        placeholder="Busque por nome, departamento, área de interesse..."
        onChange={handleChange}
        borderRadius="full"
        borderColor="gray.300"
        _hover={{ borderColor: "gray.400" }}
        _focus={{
          borderColor: "blue.500",
          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
        }}
      />
    </InputGroup>
  );
}

export default SearchBar;