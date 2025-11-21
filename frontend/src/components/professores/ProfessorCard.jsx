import { Link as RouterLink } from "react-router-dom";
import { Mail, ArrowUpRight, MapPin, FileText } from "lucide-react";
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
  Link,
} from "@chakra-ui/react";

export default function ProfessorCard({ professor }) {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const accentColor = useColorModeValue("blue.600", "blue.400");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const hoverBorderColor = useColorModeValue("blue.200", "blue.800");

  const initials = professor.nome
    ?.split(" ")
    .filter((n) => n)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const email = professor.contatos?.email || null;

  const rawLocal = professor.departamento?.split("-").slice(-1)[0].trim();
  const campus = rawLocal ? `CAMPUS UNB ${rawLocal}` : null;

  const areasInteresse = professor.dados_scholar?.areas_interesse ?? [];

  return (
    <LinkBox
      as="article"
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="2xl"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: "xl",
        borderColor: hoverBorderColor,
      }}
      role="group"
      display="flex"
      flexDirection="column"
      h="100%" // ocupa toda a célula do grid
    >
      {/* Barra azul */}
      <Box
        h="4px"
        bg={accentColor}
        width="0%"
        _groupHover={{ width: "100%" }}
        transition="0.3s"
      />

      <VStack
        align="stretch"
        p={6}
        spacing={5} // mais respiro entre os blocos
        flex="1"
        justify="space-between" // distribui topo / meio / áreas
      >
        {/* TOPO */}
        <Flex align="flex-start" gap={4}>
          <Avatar
            size="lg" // avatar maiorzinho
            src={professor.foto_url}
            name={professor.nome}
            bg="gray.200"
            color={accentColor}
            fontWeight="bold"
          >
            {!professor.foto_url && initials}
          </Avatar>

          <VStack align="start" spacing={1} flex="1">
            <HStack justify="space-between" w="full">
              <Heading
                as="h3"
                size="sm"
                textTransform="uppercase"
                noOfLines={1}
                color={accentColor}
                title={professor.nome}
              >
                <LinkOverlay as={RouterLink} to={`/professores/${professor.id}`}>
                  {professor.nome}
                </LinkOverlay>
              </Heading>

              {professor.pagina_sigaa_url && (
                <Link href={professor.pagina_sigaa_url} isExternal>
                  <Icon
                    as={ArrowUpRight}
                    color={accentColor}
                    opacity={0}
                    transition="0.2s"
                    _groupHover={{ opacity: 1 }}
                  />
                </Link>
              )}
            </HStack>

            <Text
              fontSize="xs"
              color={mutedColor}
              textTransform="uppercase"
              noOfLines={1}
            >
              {professor.departamento}
            </Text>
          </VStack>
        </Flex>

        <Divider />

        {/* CONTATOS (apenas e-mail + campus + Lattes) */}
        <VStack align="start" spacing={2} fontSize="sm">
          <HStack color={mutedColor}>
            <Icon as={Mail} boxSize={4} />
            <Text noOfLines={1}>{email || "não informado"}</Text>
          </HStack>

          {campus && (
            <HStack color={mutedColor}>
              <Icon as={MapPin} boxSize={4} />
              <Text fontSize="xs" textTransform="uppercase">
                {campus}
              </Text>
            </HStack>
          )}

          {professor.lattes_url && (
            <HStack color={accentColor}>
              <Icon as={FileText} boxSize={4} />
              <Link href={professor.lattes_url} isExternal fontSize="xs">
                Currículo Lattes
              </Link>
            </HStack>
          )}
        </VStack>

        {/* PUBLICAÇÕES (dados_scholar) */}
        {professor.dados_scholar?.publicacoes?.length > 0 && (
          <HStack color={mutedColor}>
            <Icon as={FileText} boxSize={4} />
            <Text fontSize="xs">
              {professor.dados_scholar.publicacoes.length} publicações
            </Text>
          </HStack>
        )}


        <Divider borderColor={useColorModeValue("gray.100", "gray.700")} />

        {/* ÁREAS DE INTERESSE */}
        <Box minH="56px">
          <Text
            fontSize="xs"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="wider"
            color={mutedColor}
            mb={2}
          >
            Áreas de interesse
          </Text>

          {areasInteresse.length > 0 ? (
            <HStack spacing={2} flexWrap="wrap">
              {areasInteresse.slice(0, 4).map((area) => (
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
