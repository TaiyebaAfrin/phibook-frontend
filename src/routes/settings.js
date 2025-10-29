import {
  VStack,
  Flex,
  Input,
  Button,
  Textarea,
  Heading,
  FormLabel,
  FormControl,
  Box,
  HStack,
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
import { update_user, logout } from "../api/endpoints";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const storage = JSON.parse(localStorage.getItem("userData"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Responsive values
  const sidebarDisplay = useBreakpointValue({ base: "none", lg: "block" });
  const mainPadding = useBreakpointValue({ base: "10px", md: "20px" });

  const [username, setUsername] = useState(storage ? storage.username : "");
  const [email, setEmail] = useState(storage ? storage.email : "");
  const [firstName, setFirstName] = useState(storage ? storage.first_name : "");
  const [lastName, setLastName] = useState(storage ? storage.last_name : "");
  const [bio, setBio] = useState(storage ? storage.bio : "");
  const [profileImage, setProfileImage] = useState(
    storage ? storage.profile_image : ""
  );

  const nav = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      nav("/login");
    } catch {
      alert("error logging out");
    }
  };

  const handleUpdate = async () => {
    try {
      await update_user({
        username: username,
        profile_image: profileImage,
        email: email,
        first_name: firstName,
        last_name: lastName,
        bio: bio,
      });
      localStorage.setItem(
        "userData",
        JSON.stringify({
          username: username,
          email: email,
          first_name: firstName,
          last_name: lastName,
          bio: bio,
        })
      );
      alert("successfully updated");
    } catch {
      alert("error updating details");
    }
  };

  return (
    <Flex w="100%" minH="100vh">
      {/* Mobile Menu Button */}
      <IconButton
        aria-label="Open menu"
        icon="☰"
        position="fixed"
        top="20px"
        left="20px"
        zIndex="1000"
        display={{ base: "block", lg: "none" }}
        onClick={onOpen}
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
          <Heading>Settings</Heading>

          <VStack w="100%" alignItems="start" gap="10px">
            <FormControl>
              <FormLabel>Profile Picture</FormLabel>
              <input
                onChange={(e) => setProfileImage(e.target.files[0])}
                bg="white"
                type="file"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                bg="white"
                type="text"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                bg="white"
                type="email"
              />
            </FormControl>
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                bg="white"
                type="text"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Last Name</FormLabel>
              <Input
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                bg="white"
                type="text"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Textarea
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                bg="white"
                type="text"
              />
            </FormControl>
            <Button onClick={handleUpdate} w="100%" colorScheme="blue" mt="10px">
              Save changes
            </Button>
          </VStack>

          <Button onClick={handleLogout} colorScheme="red">
            Logout
          </Button>
        </VStack>
      </Flex>
    </Flex>
  );
};

// Sidebar Component
const Sidebar = ({ onItemClick }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

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
          <Box
            boxSize="40px"
            borderRadius="full"
            bg="gray.300"
            overflow="hidden"
          >
            {/* User avatar would go here */}
          </Box>
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

export default Settings;