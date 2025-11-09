import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const MobileMenuButton = ({ onOpen }) => {
  return (
    <IconButton
      icon={<HamburgerIcon w={6} h={6} />}
      aria-label="Abrir Menu de Navegação"
      onClick={onOpen} 
      variant="ghost"
      size="md"
      display={{ base: 'block', md: 'none' }}
    />
  );
};

export default MobileMenuButton;