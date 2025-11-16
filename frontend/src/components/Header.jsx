import React from 'react';
import { 
  Box, 
  Heading, 
  HStack, 
  Link,
  useDisclosure, 
  Drawer,        
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,        
  useBreakpointValue,
  Text,
  Icon, 
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons'; 
import { Link as RouterLink } from 'react-router-dom';

import { GraduationCap } from 'lucide-react'; 

import MobileMenuButton from './MobileMenuButton'; 

function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, md: true });

  React.useEffect(() => {
    if (isDesktop && isOpen) {
      onClose();
    }
  }, [isDesktop, isOpen, onClose]);


  const NavLinks = [
    { name: 'HOME', path: '/' },
    { name: 'PROFESSORES', path: '/professores' },
    { name: 'SOBRE NÓS', path: '/sobre' },
  ];

  const LinkItems = () => (
    <>
      {NavLinks.map((link) => (
        <Link
          as={RouterLink}
          to={link.path}
          key={link.name}
          fontSize={{ base: 'md', md: 'lg' }}
          fontWeight="semibold"
          _hover={{ color: 'blue.500' }}
        >
          {link.name}
        </Link>
      ))}
    </>
  );

  const DrawerLinkItems = ({ onClose }) => (
    <VStack 
      spacing={6} 
      align="start" 
      onClick={onClose} 
    >
      {NavLinks.map((link) => (
        <Link
          as={RouterLink}
          to={link.path}
          key={link.name}
          fontSize="lg"
          fontWeight="medium"
          _hover={{ color: 'blue.500' }}
        >
          {link.name}
        </Link>
      ))}
    </VStack>
  );


  return (
    <Box as="header" bg="white" boxShadow="sm" px={{ base: 6, md: 12 }} py={{ base: 5, md: 6 }} zIndex={10}>
      <HStack 
          justifyContent="space-between" 
          alignItems="center" 
          /* REMOVIDO: maxW="container.lg" */ 
          /* REMOVIDO: mx="auto" */
      >
        
        {/* === HUB DOCENTE COM ÍCONE === */}
        <HStack spacing={3} alignItems="center"> 
            <Icon as={GraduationCap} boxSize={{ base: 6, md: 7 }} color="blue.600" /> {/* Ícone de formatura */}
            <Heading as="h1" size={{ base: 'lg', md: 'xl' }}>
              <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>Hub Docente</Link>
            </Heading>
        </HStack>
        
        {/* VERSÃO DESKTOP: LINKS COMPLETOS */}
        <HStack as="nav" spacing={8} display={{ base: 'none', md: 'flex' }}>
          <LinkItems />
        </HStack>

        {/* VERSÃO MOBILE: BOTÃO HAMBURGER */}
        {!isDesktop && (
          <MobileMenuButton onOpen={onOpen} />
        )}
      </HStack>
      
      {/* DRAWER (Gaveta lateral) - Não precisa de alteração, pois já ocupa a tela. */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          
          <DrawerHeader borderBottomWidth="1px">
            <HStack spacing={2}>
              <HamburgerIcon />
              <Text>Menu de Navegação</Text>
            </HStack>
          </DrawerHeader>
          
          <DrawerBody mt={4}>
            <DrawerLinkItems onClose={onClose} /> 
          </DrawerBody>
          
        </DrawerContent>
      </Drawer>

    </Box>
  );
}

export default Header;