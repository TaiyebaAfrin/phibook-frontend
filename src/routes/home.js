import { 
  Heading, 
  VStack, 
  Text, 
  Flex, 
  Button,
  Box,
  HStack,
  Spacer,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  useDisclosure 
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { get_posts } from "../api/endpoints";
import Post from "../components/post";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Responsive values
  const sidebarDisplay = useBreakpointValue({ base: "none", lg: "block" });
  const mainPadding = useBreakpointValue({ base: "10px", md: "20px" });

  // Load initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await get_posts(1);
        setPosts(data.results);
        setNextPage(data.next ? 2 : null);
      } catch {
        alert("error getting posts");
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const loadMorePosts = async () => {
    if (nextPage) {
      try {
        const data = await get_posts(nextPage);
        setPosts(prevPosts => [...prevPosts, ...data.results]);
        setNextPage(data.next ? nextPage + 1 : null);
      } catch {
        alert("error getting more posts");
      }
    }
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

      {/* Left Sidebar - Desktop - Fixed Position */}
      <Box 
        w="250px" 
        bg="gray.50" 
        p="20px" 
        borderRight="1px solid" 
        borderColor="gray.200"
        display={sidebarDisplay}
        position="fixed"
        left="0"
        top="0"
        height="100vh"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'gray.400',
            borderRadius: '24px',
          },
        }}
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
      
      {/* Main Content - Offset for fixed sidebar */}
      <Flex 
        flex="1" 
        justifyContent="center" 
        p={mainPadding} 
        ml={{ base: 0, lg: "250px" }}
      >
        <VStack w="95%" maxW="600px" alignItems="start" gap="20px" mt={{ base: "60px", lg: "50px" }} pb="50px">
          <Heading>Posts</Heading>
          {loading ? (
            <Text>Loading...</Text>
          ) : posts.length > 0 ? (
            posts.map((post) => {
              return (
                <Post
                  key={post.id}
                  id={post.id}
                  username={post.username}
                  description={post.description}
                  formatted_date={post.formatted_date}
                  liked={post.liked}
                  like_count={post.like_count}
                />
              );
            })
          ) : (
            <Text color="gray.500" textAlign="center" w="100%" py="40px">
              No posts found
            </Text>
          )}

          {nextPage && !loading && (
            <Button onClick={loadMorePosts} w="100%">
              Load More
            </Button>
          )}
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

export default Home;