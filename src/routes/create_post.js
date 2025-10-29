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
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from "@chakra-ui/react";
import { create_post } from "../api/endpoints";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const nav = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const sidebarDisplay = useBreakpointValue({ base: "none", lg: "block" });
  const mainPadding = useBreakpointValue({ base: "10px", md: "20px" });

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setActiveTab(1); // Switch to image tab
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePost = async () => {
    if (!description.trim() && !image && !videoUrl && !linkUrl) {
      alert('Please add some content to your post');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('description', description);
      
      if (image) {
        formData.append('image', image);
      }
      if (videoUrl) {
        formData.append('video_url', videoUrl);
      }
      if (linkUrl) {
        formData.append('link_url', linkUrl);
      }

      await create_post(formData);
      nav('/');
    } catch (error) {
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  const isYouTubeUrl = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
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
        <VStack w='95%' maxW='600px' alignItems='start' gap='30px' mt={{ base: "60px", lg: "50px" }}>
          <Heading>Create Post</Heading>
          
          <Tabs w="100%" index={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>Text</Tab>
              <Tab>Image</Tab>
              <Tab>Video</Tab>
              <Tab>Link</Tab>
            </TabList>

            <TabPanels>
              {/* Text Post */}
              <TabPanel p="20px 0">
                <FormControl>
                  <FormLabel>What's on your mind?</FormLabel>
                  <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    bg='white' 
                    placeholder="Share your thoughts..."
                    rows={6}
                  />
                </FormControl>
              </TabPanel>

              {/* Image Post */}
              <TabPanel p="20px 0">
                <FormControl>
                  <FormLabel>Upload Image</FormLabel>
                  <Input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*"
                    onChange={handleImageSelect}
                    p="5px"
                  />
                  {imagePreview && (
                    <Box mt="20px">
                      <Image 
                        src={imagePreview} 
                        alt="Preview" 
                        maxH="300px" 
                        borderRadius="8px"
                      />
                      <Button 
                        mt="10px" 
                        colorScheme="red" 
                        size="sm" 
                        onClick={removeImage}
                      >
                        Remove Image
                      </Button>
                    </Box>
                  )}
                  <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    bg='white' 
                    placeholder="Add a caption..."
                    rows={3}
                    mt="20px"
                  />
                </FormControl>
              </TabPanel>

              {/* Video Post */}
              <TabPanel p="20px 0">
                <FormControl>
                  <FormLabel>YouTube Video URL</FormLabel>
                  <Input 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    bg='white' 
                    type='url'
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {videoUrl && isYouTubeUrl(videoUrl) && (
                    <Alert status="success" mt="10px">
                      <AlertIcon />
                      YouTube video detected
                    </Alert>
                  )}
                  <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    bg='white' 
                    placeholder="Add a description..."
                    rows={3}
                    mt="20px"
                  />
                </FormControl>
              </TabPanel>

              {/* Link Post */}
              <TabPanel p="20px 0">
                <FormControl>
                  <FormLabel>Website URL</FormLabel>
                  <Input 
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    bg='white' 
                    type='url'
                    placeholder="https://example.com"
                  />
                  <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    bg='white' 
                    placeholder="Add your thoughts about this link..."
                    rows={3}
                    mt="20px"
                  />
                </FormControl>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Button 
            onClick={handlePost} 
            w='100%' 
            colorScheme="blue" 
            isLoading={loading}
            loadingText="Creating Post"
          >
            Create Post
          </Button>
        </VStack>
      </Flex>
    </Flex>
  )
}

// Sidebar Component (same as before)
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
    { label: "My Profile", icon: "👤", path: `/user/${currentUser?.username || ''}` },
    { label: "Settings", icon: "⚙️", path: "/settings" },
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

export default CreatePost;





























// import { 
//   VStack, 
//   Flex, 
//   Heading, 
//   FormControl, 
//   FormLabel, 
//   Input, 
//   Button,
//   Box,
//   HStack,
//   Text,
//   Spacer,
//   useBreakpointValue,
//   Drawer,
//   DrawerBody,
//   DrawerHeader,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerCloseButton,
//   IconButton,
//   useDisclosure 
// } from "@chakra-ui/react";
// import { create_post } from "../api/endpoints";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const CreatePost = () => {
//   const [description, setDescription] = useState('')
//   const nav = useNavigate()
//   const { isOpen, onOpen, onClose } = useDisclosure();
  
//   // Responsive values
//   const sidebarDisplay = useBreakpointValue({ base: "none", lg: "block" });
//   const mainPadding = useBreakpointValue({ base: "10px", md: "20px" });

//   const handlePost = async () => {
//     try {   
//       await create_post(description)
//       nav('/')
//     } catch {
//       alert('error creating post')
//     }
//   }

//   return (
//     <Flex w='100%' minH='100vh'>
//       {/* Mobile Menu Button - Black and White */}
//       <IconButton
//         aria-label="Open menu"
//         icon="☰"
//         position="fixed"
//         top="20px"
//         left="20px"
//         zIndex="1000"
//         display={{ base: "block", lg: "none" }}
//         onClick={onOpen}
//         bg="white"
//         color="black"
//         border="1px solid"
//         borderColor="gray.300"
//         _hover={{ bg: "gray.50" }}
//         _active={{ bg: "gray.100" }}
//       />

//       {/* Left Sidebar - Desktop - Not Fixed */}
//       <Box 
//         w="250px" 
//         bg="gray.50" 
//         p="20px" 
//         borderRight="1px solid" 
//         borderColor="gray.200"
//         display={sidebarDisplay}
//       >
//         <Sidebar />
//       </Box>
      
//       {/* Mobile Sidebar Drawer */}
//       <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
//         <DrawerOverlay />
//         <DrawerContent>
//           <DrawerCloseButton />
//           <DrawerHeader>PhiBook</DrawerHeader>
//           <DrawerBody>
//             <Sidebar onItemClick={onClose} />
//           </DrawerBody>
//         </DrawerContent>
//       </Drawer>
      
//       {/* Main Content */}
//       <Flex flex="1" justifyContent="center" p={mainPadding}>
//         <VStack w='95%' maxW='450px' alignItems='start' gap='40px' mt={{ base: "60px", lg: "50px" }}>
//           <Heading>Create Post</Heading>
//           <FormControl>
//             <FormLabel>Description</FormLabel>
//             <Input 
//               onChange={(e) => setDescription(e.target.value)} 
//               bg='white' 
//               type='text'
//               placeholder="What's on your mind?"
//             />
//           </FormControl>
//           <Button onClick={handlePost} w='100%' colorScheme="blue">Create Post</Button>
//         </VStack>
//       </Flex>
//     </Flex>
//   )
// }

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

// export default CreatePost;