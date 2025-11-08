import {
  VStack,
  Flex,
  HStack,
  Input,
  Button,
  Box,
  Image,
  Heading,
  Text,
  Spacer,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { SERVER_URL } from "../constants/constants";
import { useNavigate } from "react-router-dom";
import { search_users } from "../api/endpoints";

const Search = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Responsive values
  const sidebarDisplay = useBreakpointValue({ base: "none", lg: "block" });
  const mainPadding = useBreakpointValue({ base: "10px", md: "20px" });

  const handleSearch = async () => {
    const users = await search_users(search);
    setUsers(users);
  };

  return (
    <Flex w="100%" minH="100vh">
      {/* Mobile Menu Button - Black and White */}
      <IconButton
        aria-label="Open menu"
        icon="☰"
        position="fixed"
        top="20px"
        left="20px"
        zIndex="1000"
        display={{ base: "block", lg: "none" }}
        onClick={onOpen}
        bg="white"
        color="black"
        border="1px solid"
        borderColor="gray.300"
        _hover={{ bg: "gray.50" }}
        _active={{ bg: "gray.100" }}
      />

      {/* Left Sidebar - Desktop */}
      <Box 
        w="250px" 
        bg="gray.50" 
        p="20px" 
        borderRight="1px solid" 
        borderColor="gray.200"
        display={sidebarDisplay}
      >
        <Sidebar />
      </Box>
      
      {/* Mobile Sidebar Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>PhiBook</DrawerHeader>
          <DrawerBody>
            <Sidebar onItemClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      
      {/* Main Content */}
      <Flex flex="1" justifyContent="center" p={mainPadding} ml={{ base: 0, lg: 0 }}>
        <VStack w="95%" maxW="500px" alignItems="start" gap="20px" mt={{ base: "60px", lg: "50px" }}>
          <Heading>Search Users</Heading>
          <HStack w="100%" gap="0">
            <Input 
              onChange={(e) => setSearch(e.target.value)} 
              bg="white" 
              placeholder="Search for users..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button onClick={handleSearch} colorScheme="blue">
              Search
            </Button>
          </HStack>
          <VStack w="100%" spacing="15px">
            {users.map((user) => {
              return (
                <UserProfile
                  key={user.username}
                  username={user.username}
                  profile_image={user.profile_image}
                  first_name={user.first_name}
                  last_name={user.last_name}
                />
              );
            })}
            {users.length === 0 && search && (
              <Text color="gray.500" textAlign="center" w="100%" py="40px">
                No users found
              </Text>
            )}
          </VStack>
        </VStack>
      </Flex>
    </Flex>
  );
};

const UserProfile = ({ username, profile_image, first_name, last_name }) => {
  const nav = useNavigate();

  const handleNav = () => {
    nav(`/${username}`);
  };

  return (
    <Flex
      onClick={handleNav}
      w="100%"
      h="100px"
      border="1px solid"
      borderColor="gray.300"
      borderRadius="8px"
      bg="white"
      justifyContent="center"
      alignItems="center"
      cursor="pointer"
      _hover={{ bg: "gray.50", transform: "translateY(-2px)", boxShadow: "md" }}
      transition="all 0.2s"
    >
      <HStack w="90%" gap="20px" alignItems="center">
        <Box
          boxSize="70px"
          borderRadius="full"
          overflow="hidden"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
        >
          <Image
            src={`${SERVER_URL}${profile_image}`}
            boxSize="100%"
            objectFit="cover"
          />
        </Box>

        <VStack alignItems="start" gap="3px">
          <Text fontWeight="medium" fontSize="16px">
            {first_name} {last_name}
          </Text>
          <Text color="gray.600" fontSize="14px">
            @{username}
          </Text>
        </VStack>
      </HStack>
    </Flex>
  );
};

// // Sidebar Component
// const Sidebar = ({ onItemClick }) => {
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     const userData = localStorage.getItem("userData");
//     if (userData) {
//       setCurrentUser(JSON.parse(userData));
//     }
//   }, []);

//   const menuItems = [
//     { label: "Home", icon: "🏠", path: "/" },
//     { label: "Search", icon: "🔍", path: "/search" },
//     { label: "Create Post", icon: "✏️", path: "/create/post" },
//     { label: "Messages", icon: "💬", path: "/" },
//     { label: "Settings", icon: "⚙️", path: "/settings" },
//     { label: "Subscriptions", icon: "👤", path: "/subscriptions" },
//   ];

//   const handleItemClick = (path) => {
//     if (onItemClick) {
//       onItemClick();
//     }
//     window.location.href = path;
//   };

//   return (
//     <VStack align="start" spacing="20px" h="100%">
//       <Heading size="lg" mb="30px" color="blue.600" display={{ base: "none", lg: "block" }}>
//         PhiBook
//       </Heading>
      
//       {menuItems.map((item, index) => (
//         <Button
//           key={index}
//           variant="ghost"
//           justifyContent="start"
//           w="100%"
//           p="10px 15px"
//           borderRadius="10px"
//           _hover={{ bg: "blue.50", color: "blue.600" }}
//           onClick={() => handleItemClick(item.path)}
//         >
//           <HStack spacing="15px">
//             <Text fontSize="18px">{item.icon}</Text>
//             <Text fontWeight="medium">{item.label}</Text>
//           </HStack>
//         </Button>
//       ))}
      
//       <Spacer />
      
//       {/* User info section */}
//       <Box mt="auto" pt="20px" borderTop="1px solid" borderColor="gray.200" w="100%">
//         <HStack spacing="10px">
//           <Box
//             boxSize="40px"
//             borderRadius="full"
//             bg="gray.300"
//             overflow="hidden"
//           >
//             {/* User avatar would go here */}
//           </Box>
//           <VStack align="start" spacing="0">
//             <Text fontWeight="bold" fontSize="14px">
//               {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "Current User"}
//             </Text>
//             <Text fontSize="12px" color="gray.600">
//               @{currentUser ? currentUser.username : "username"}
//             </Text>
//           </VStack>
//         </HStack>
//       </Box>
//     </VStack>
//   );
// };
// Sidebar Component
const Sidebar = ({ onItemClick }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // Function to get first letter of username
  const getFirstLetter = (username) => {
    return username ? username.charAt(0).toUpperCase() : "U";
  };

  const menuItems = [
    { label: "Home", icon: "🏠", path: "/" },
    { label: "Search", icon: "🔍", path: "/search" },
    { label: "Create Post", icon: "✏️", path: "/create/post" },
    { label: "Messages", icon: "💬", path: "/" },
    { label: "Settings", icon: "⚙️", path: "/settings" },
    { label: "Subscriptions", icon: "👤", path: "/subscriptions" },
  ];

  const handleItemClick = (path) => {
    if (onItemClick) {
      onItemClick();
    }
    window.location.href = path;
  };

  return (
    <VStack align="start" spacing="20px" h="100%">
      <Heading size="lg" mb="30px" color="blue.600" display={{ base: "none", lg: "block" }}>
        PhiBook
      </Heading>
      
      {menuItems.map((item, index) => (
        <Button
          key={index}
          variant="ghost"
          justifyContent="start"
          w="100%"
          p="10px 15px"
          borderRadius="10px"
          _hover={{ bg: "blue.50", color: "blue.600" }}
          onClick={() => handleItemClick(item.path)}
        >
          <HStack spacing="15px">
            <Text fontSize="18px">{item.icon}</Text>
            <Text fontWeight="medium">{item.label}</Text>
          </HStack>
        </Button>
      ))}
      
      <Spacer />
      
      {/* User info section */}
      <Box mt="auto" pt="20px" borderTop="1px solid" borderColor="gray.200" w="100%">
        <HStack spacing="10px">
          <Flex
            boxSize="40px"
            borderRadius="full"
            bg="blue.500"
            overflow="hidden"
            align="center"
            justify="center"
            color="white"
            fontWeight="bold"
            fontSize="16px"
          >
            {currentUser ? getFirstLetter(currentUser.username) : "U"}
          </Flex>
          <VStack align="start" spacing="0">
            <Text fontWeight="bold" fontSize="14px">
              {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "Current User"}
            </Text>
            <Text fontSize="12px" color="gray.600">
              @{currentUser ? currentUser.username : "username"}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </VStack>
  );
};

export default Search;