import { Link as RouterLink } from "react-router-dom";
import { Mail, ArrowUpRight, MapPin } from "lucide-react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Avatar,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  LinkBox,
  LinkOverlay,
  Divider,
  Tag,
  TagLabel,
} from "@chakra-ui/react";

export default function ProfessorCard({ professor }) {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const accentColor = useColorModeValue("blue.600", "blue.400");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const hoverBorderColor = useColorModeValue("blue.200", "blue.800");

  const initials = professor.nome
    ? professor.nome
        .split(" ")
        .filter((n) => n.length > 0)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "UN";

  const email = professor.contatos?.email;
  const foto = professor.foto_url;

  // tenta extrair o "local" do departamento: "... - BRASÍLIA" → "BRASÍLIA"
  const rawLocal = professor.departamento
    ? professor.departamento.split("-").slice(-1)[0].trim()
    : null;
  const campus = rawLocal ? `CAMPUS UNB ${rawLocal}` : null;

  // deixa preparado caso o backend passe a mandar áreas
  const areasPesquisa =
    professor.areas_pesquisa ||
    professor.areas ||
    professor.dados_lattes?.areas_pesquisa ||
    [];

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
      display="flex"
      flexDirection="column"
    >
      <Box
        h="4px"
        bg={accentColor}
        width="0%"
        transition="width 0.3s ease"
        _groupHover={{ width: "100%" }}
      />

      <VStack align="stretch" p={6} spacing={4} flex="1">
        {/* TOPO – avatar + nome + departamento (segue a ideia do 1º card) */}
        <Flex align="flex-start" gap={4}>
          <Avatar
            size="md"
            name={professor.nome}
            src={foto}
            bg={useColorModeValue("gray.100", "gray.700")}
            color={accentColor}
            fontWeight="bold"
            borderWidth="2px"
            borderColor="transparent"
            _groupHover={{ borderColor: accentColor }}
            transition="all 0.3s ease"
          >
            {!foto && initials}
          </Avatar>

          <VStack align="start" spacing={1} flex={1} minW={0}>
            <HStack justify="space-between" width="full" align="flex-start">
              <Heading
                as="h3"
                size="sm"
                lineHeight="shorter"
                textTransform="uppercase"
                letterSpacing="wide"
                noOfLines={1}
                title={professor.nome}
              >
                <LinkOverlay
                  as={RouterLink}
                  to={`/professores/${professor.id}`}
                  color={accentColor}
                  _visited={{ color: accentColor }}
                >
                  {professor.nome}
                </LinkOverlay>
              </Heading>

              <Icon
                as={ArrowUpRight}
                color={accentColor}
                opacity={0}
                transform="translate(-8px, 8px)"
                transition="all 0.2s ease"
                _groupHover={{ opacity: 1, transform: "translate(0, 0)" }}
              />
            </HStack>

            {professor.departamento && (
              <Text
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wider"
                color={mutedColor}
                noOfLines={1}
              >
                {professor.departamento}
              </Text>
            )}
          </VStack>
        </Flex>

        <Divider borderColor={useColorModeValue("gray.50", "gray.700")} />

        {/* MEIO – email + campus (ícones igual ao exemplo) */}
        <VStack align="start" spacing={2} fontSize="sm">
          <HStack
            align="center"
            gap={3}
            color={mutedColor}
            _hover={{ color: accentColor }}
            transition="color 0.2s"
          >
            <Icon as={Mail} boxSize={4} />
            <Text noOfLines={1} title={email || "não informado"}>
              {email ? email.toLowerCase() : "não informado"}
            </Text>
          </HStack>

          {campus && (
            <HStack align="center" gap={3} color={mutedColor}>
              <Icon as={MapPin} boxSize={4} />
              <Text
                noOfLines={1}
                textTransform="uppercase"
                fontSize="xs"
                fontWeight="medium"
              >
                {campus}
              </Text>
            </HStack>
          )}
        </VStack>

        {/* BASE – ÁREAS DE PESQUISA (chips/pílulas) */}
        <Box pt={3}>
          <Text
            fontSize="xs"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="wider"
            color={mutedColor}
            mb={2}
          >
            Áreas de pesquisa
          </Text>

          {areasPesquisa.length > 0 ? (
            <HStack spacing={2} flexWrap="wrap">
              {areasPesquisa.slice(0, 4).map((area) => (
                <Tag
                  key={area}
                  size="sm"
                  borderRadius="full"
                  bg={useColorModeValue("blue.50", "blue.900")}
                >
                  <TagLabel fontSize="xs">{area}</TagLabel>
                </Tag>
              ))}
            </HStack>
          ) : (
            <Text fontSize="xs" color={mutedColor} fontStyle="italic">
              dados em atualização
            </Text>
          )}
        </Box>
      </VStack>
    </LinkBox>
  );
}
