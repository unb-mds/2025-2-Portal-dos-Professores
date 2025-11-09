import React from 'react';
import { 
  Box, 
  Heading, 
  HStack, 
  VStack, 
  Link,
  useDisclosure, 
  Drawer,        
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Text 
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
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
          fontSize="md" 
          fontWeight="medium"
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
    <Box as="header" bg="white" boxShadow="sm" px={{ base: 4, md: 8 }} py={4} zIndex={10}>
      <HStack 
          justifyContent="space-between" 
          alignItems="center" 
          maxW="container.lg" 
          mx="auto"
      >
        
        <Heading as="h1" size="md">
          <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>Hub Docente</Link>
        </Heading>

        {/* VERSÃO DESKTOP: LINKS COMPLETOS (HStack com os Links) */}
        <HStack as="nav" spacing={6} display={{ base: 'none', md: 'flex' }}>
          <LinkItems />
        </HStack>

        {/* VERSÃO MOBILE: BOTÃO HAMBURGER */}
        {!isDesktop && (
          <MobileMenuButton onOpen={onOpen} />
        )}
      </HStack>
      
      {/* DRAWER (Gaveta lateral) */}
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
            {/* Usa a versão de Links Verticais */}
            <DrawerLinkItems onClose={onClose} /> 
          </DrawerBody>
          
        </DrawerContent>
      </Drawer>

    </Box>
  );
}

export default Header;