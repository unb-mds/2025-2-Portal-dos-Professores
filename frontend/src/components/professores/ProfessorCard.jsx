import { Link as RouterLink } from "react-router-dom";
import { Mail, MapPin, BookOpen, ArrowUpRight } from "lucide-react";
import {
  Box, Flex, Heading, Text, Badge, Avatar,
  VStack, HStack, Icon, useColorModeValue,
  LinkBox, LinkOverlay, Divider, Tooltip
} from "@chakra-ui/react";

export default function ProfessorCard({ professor }) {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  
  
  const accentColor = useColorModeValue("purple.600", "purple.300");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const hoverBorderColor = useColorModeValue("purple.200", "purple.800");

  
  const initials = professor.nome
      ? professor.nome.split(" ").filter(n => n.length > 0).map((n) => n[0]).join("").slice(0, 2).toUpperCase()
      : "UN";

  return (
    <LinkBox 
      as="article" 
      height="100%"
      bg={bg}
      borderWidth="1px" 
      borderColor={borderColor}
      borderRadius="2xl"
      position="relative"
      overflow="hidden"
      transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
      _hover={{ 
        transform: "translateY(-6px)",
        boxShadow: "xl",
        borderColor: hoverBorderColor,
      }}
      role="group"
    >
      
      <Box h="4px" bg={accentColor} width="0%" transition="width 0.3s ease" _groupHover={{ width: "100%" }} />

      <VStack align="stretch" p={6} spacing={5} height="100%">
        
        {/* CABEÇALHO */}
        <Flex align="start" gap={4}>
          <Avatar
            size="md"
            name={professor.nome}
            src={professor.fotoUrl}
            
            bg={useColorModeValue("gray.100", "gray.700")}
            color={accentColor}
            fontWeight="bold"
            borderWidth="2px" borderColor="transparent"
            _groupHover={{ borderColor: accentColor }}
            transition="all 0.3s ease"
          />
          <VStack align="start" spacing={1} flex={1} minW={0}>
            <HStack justify="space-between" width="full">
              <Heading as="h3" size="md" lineHeight="shorter" noOfLines={2} title={professor.nome}>
                <LinkOverlay as={RouterLink} to={`/professores/${professor.id}`}>
                  {professor.nome}
                </LinkOverlay>
              </Heading>
              
              <Icon as={ArrowUpRight} color={accentColor} opacity={0} transform="translate(-10px, 10px)" transition="all 0.3s ease" _groupHover={{ opacity: 1, transform: "translate(0, 0)" }} />
            </HStack>
            <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color={mutedColor} noOfLines={1}>
              {professor.departamento}
            </Text>
          </VStack>
        </Flex>

        <Divider borderColor={useColorModeValue("gray.50", "gray.700")} />

        {/* CORPO */}
        <VStack align="start" spacing={3} flex={1}>
          {professor.email && (
            <Flex align="center" gap={3} color={mutedColor} fontSize="sm" _hover={{ color: accentColor }} transition="colors 0.2s">
               <Icon as={Mail} boxSize={4} />
               <Text noOfLines={1} title={professor.email}>
                 {professor.email.toLowerCase()}
               </Text>
            </Flex>
          )}
          {professor.campus && (
            <Flex align="center" gap={3} color={mutedColor} fontSize="sm">
               <Icon as={MapPin} boxSize={4} />
               <Text noOfLines={1}>{professor.campus}</Text>
            </Flex>
          )}
        </VStack>

        {/* RODAPÉ (TAGS) */}
        {professor.areasPesquisa?.length > 0 && (
          <Box>
            <HStack mb={3} spacing={2} color={mutedColor} fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
              <Icon as={BookOpen} boxSize={3.5} />
              <Text>Áreas de Pesquisa</Text>
            </HStack>
            <Flex flexWrap="wrap" gap={2}>
              {professor.areasPesquisa.slice(0, 3).map((area, idx) => (
                <Tooltip key={idx} label="Filtrar por esta área (Em breve)" hasArrow fontSize="xs">
                  <Badge 
                    px={3} py={1} 
                    
                    bg={useColorModeValue("purple.50", "purple.900")} 
                    color={accentColor}
                    fontWeight="semibold" fontSize="0.7rem" borderRadius="full"
                    textTransform="none" cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ bg: accentColor, color: "white", transform: "scale(1.05)" }}
                  >
                    {area}
                  </Badge>
                </Tooltip>
              ))}
              {professor.areasPesquisa.length > 3 && (
                 <Badge px={2} py={1} variant="ghost" color={mutedColor} fontSize="0.7rem" borderRadius="full">
                  +{professor.areasPesquisa.length - 3}
                </Badge>
              )}
            </Flex>
          </Box>
        )}
      </VStack>
    </LinkBox>
  );
}