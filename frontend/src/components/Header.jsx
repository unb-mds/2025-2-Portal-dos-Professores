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
  useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons'; 
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { GraduationCap } from 'lucide-react'; 

import MobileMenuButton from './MobileMenuButton'; 

function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const location = useLocation();
  
  const headerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    return location.pathname.startsWith(path);
  };

  const LinkItems = () => (
    <>
      {NavLinks.map((link) => {
        const active = isActive(link.path);
        return (
          <Link
            as={RouterLink}
            to={link.path}
            key={link.name}
            fontSize={{ base: 'md', md: 'lg' }}
            fontWeight={active ? 'bold' : 'semibold'}
            color={active ? 'blue.600' : 'gray.700'}
            position="relative"
            px={3}
            py={2}
            borderRadius="md"
            transition="all 0.2s"
            _hover={{
              color: 'blue.600',
              bg: 'blue.50',
            }}
            _active={{
              color: 'blue.700',
            }}
          >
            {link.name}
            {active && (
              <Box
                position="absolute"
                bottom={0}
                left="50%"
                transform="translateX(-50%)"
                width="80%"
                height="3px"
                bg="blue.600"
                borderRadius="full"
              />
            )}
          </Link>
        );
      })}
    </>
  );

  const DrawerLinkItems = ({ onClose }) => (
    <VStack 
      spacing={4} 
      align="stretch" 
      onClick={onClose} 
    >
      {NavLinks.map((link) => {
        const active = isActive(link.path);
        return (
          <Link
            as={RouterLink}
            to={link.path}
            key={link.name}
            fontSize="lg"
            fontWeight={active ? 'bold' : 'medium'}
            color={active ? 'blue.600' : 'gray.700'}
            px={4}
            py={3}
            borderRadius="md"
            bg={active ? 'blue.50' : 'transparent'}
            borderLeft={active ? '4px solid' : '4px solid transparent'}
            borderColor={active ? 'blue.600' : 'transparent'}
            transition="all 0.2s"
            _hover={{
              color: 'blue.600',
              bg: 'blue.50',
              borderColor: 'blue.300',
            }}
          >
            {link.name}
          </Link>
        );
      })}
    </VStack>
  );


  return (
    <Box 
      as="header" 
      bg={headerBg} 
      boxShadow="md" 
      borderBottomWidth="1px"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <HStack 
        justifyContent="space-between" 
        alignItems="center" 
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 5 }}
        w="100%"
      >
          
          {/* === HUB DOCENTE COM ÍCONE === */}
          <Link 
            as={RouterLink} 
            to="/" 
            _hover={{ textDecoration: 'none' }}
            transition="transform 0.2s"
            _active={{ transform: 'scale(0.98)' }}
          >
            <HStack spacing={3} alignItems="center">
              <Icon 
                as={GraduationCap} 
                boxSize={{ base: 7, md: 8 }} 
                color="blue.600"
                transition="transform 0.2s"
                _groupHover={{ transform: 'scale(1.1)' }}
              />
              <Heading 
                as="h1" 
                size={{ base: 'lg', md: 'xl' }}
                color="blue.800"
                letterSpacing="tight"
                fontWeight="semibold"
              >
                Hub Docente
              </Heading>
            </HStack>
          </Link>
          
          {/* VERSÃO DESKTOP: LINKS COMPLETOS */}
          <HStack as="nav" spacing={2} display={{ base: 'none', md: 'flex' }}>
            <LinkItems />
          </HStack>

          {/* VERSÃO MOBILE: BOTÃO HAMBURGER */}
          {!isDesktop && (
            <MobileMenuButton onOpen={onOpen} />
          )}
        </HStack>
      
      {/* DRAWER (Gaveta lateral) */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen} size="sm">
        <DrawerOverlay bg="blackAlpha.600" />
        <DrawerContent>
          <DrawerCloseButton size="lg" />
          
          <DrawerHeader 
            borderBottomWidth="1px"
            borderColor={borderColor}
            pb={4}
          >
            <HStack spacing={3}>
              <Icon as={GraduationCap} boxSize={6} color="blue.600" />
              <Text fontSize="xl" fontWeight="bold" color="blue.800">
                Menu de Navegação
              </Text>
            </HStack>
          </DrawerHeader>
          
          <DrawerBody pt={6}>
            <DrawerLinkItems onClose={onClose} /> 
          </DrawerBody>
          
        </DrawerContent>
      </Drawer>

    </Box>
  );
}

export default Header;