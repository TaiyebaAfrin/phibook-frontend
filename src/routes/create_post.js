import { 
  VStack, 
  Flex, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Button,
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
  Textarea,
  Image,
  Icon,
  useToast
} from "@chakra-ui/react";
import { create_post } from "../api/endpoints";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiFile, FiImage, FiX } from "react-icons/fi";

const CreatePost = () => {
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const toast = useToast();
  
  const sidebarDisplay = useBreakpointValue({ base: "none", lg: "block" });
  const mainPadding = useBreakpointValue({ base: "10px", md: "20px" });

  const handlePost = async () => {
    try {
      if (!description.trim() && !selectedImage && !selectedFile) {
        toast({
          title: "Please add content",
          description: "Add a description, image, or file to create a post",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setIsLoading(true);

      const formData = new FormData();
      formData.append('description', description);
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      await create_post(formData);
      
      toast({
        title: "Post created successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      
      nav('/');
    } catch (error) {
      console.error(error);
      toast({
        title: "Error creating post",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearAll = () => {
    setDescription('');
    setSelectedImage(null);
    setSelectedFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Flex w='100%' minH='100vh'>
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
      <Flex flex="1" justifyContent="center" p={mainPadding}>
        <VStack w='95%' maxW='450px' alignItems='start' gap='30px' mt={{ base: "60px", lg: "50px" }}>
          <Heading>Create Post</Heading>
          
          {/* Description */}
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)} 
              bg='white' 
              placeholder="What's on your mind?"
              rows={4}
            />
          </FormControl>

          {/* Image Upload */}
          <FormControl>
            <FormLabel>Add Image</FormLabel>
            <Input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              display="none"
            />
            <Button
              leftIcon={<Icon as={FiImage} />}
              onClick={() => imageInputRef.current?.click()}
              w="100%"
              variant="outline"
              isDisabled={isLoading}
            >
              Choose Image
            </Button>
            {imagePreview && (
              <Box mt={3} position="relative">
                <Image src={imagePreview} alt="Preview" maxH="200px" borderRadius="md" />
                <IconButton
                  icon={<FiX />}
                  size="sm"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={removeImage}
                  bg="red.500"
                  color="white"
                  _hover={{ bg: "red.600" }}
                  isDisabled={isLoading}
                />
              </Box>
            )}
          </FormControl>

          {/* File Upload */}
          <FormControl>
            <FormLabel>Add File</FormLabel>
            <Input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              display="none"
            />
            <Button
              leftIcon={<Icon as={FiFile} />}
              onClick={() => fileInputRef.current?.click()}
              w="100%"
              variant="outline"
              isDisabled={isLoading}
            >
              Choose File
            </Button>
            {selectedFile && (
              <Box mt={3} p={3} bg="gray.50" borderRadius="md">
                <HStack justify="space-between">
                  <Text fontSize="sm" isTruncated maxW="80%">
                    {selectedFile.name}
                  </Text>
                  <IconButton
                    icon={<FiX />}
                    size="sm"
                    onClick={removeFile}
                    variant="ghost"
                    isDisabled={isLoading}
                  />
                </HStack>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </Text>
              </Box>
            )}
          </FormControl>

          <HStack w="100%" spacing={3}>
            <Button 
              onClick={clearAll}
              w='50%'
              variant="outline"
              isDisabled={isLoading || (!description && !selectedImage && !selectedFile)}
            >
              Clear All
            </Button>
            <Button 
              onClick={handlePost} 
              w='50%' 
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Creating..."
              isDisabled={(!description.trim() && !selectedImage && !selectedFile) || isLoading}
            >
              Create Post
            </Button>
          </HStack>
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

export default CreatePost;