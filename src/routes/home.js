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
  useDisclosure,
  useToast,
  Skeleton,
  SkeletonText,
  SkeletonCircle
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { get_posts } from "../api/endpoints";
import Post from "../components/post";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  // Responsive values
  const sidebarDisplay = useBreakpointValue({ base: "none", lg: "block" });
  const mainPadding = useBreakpointValue({ base: "10px", md: "20px" });

  // Load initial data
  const fetchPosts = useCallback(async (page = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await get_posts(page);
      
      if (isLoadMore) {
        setPosts(prevPosts => [...prevPosts, ...data.results]);
      } else {
        setPosts(data.results);
      }
      
      setNextPage(data.next ? page + 1 : null);
      setHasMore(!!data.next);
      
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error loading posts",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [toast]);

  // Load initial data on component mount
  useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  const loadMorePosts = async () => {
    if (nextPage && hasMore && !loadingMore) {
      await fetchPosts(nextPage, true);
    }
  };

  // Post Skeleton Loader Component
  const PostSkeleton = () => (
    <VStack
      w="400px"
      h="400px"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="8px"
      p={4}
      spacing={4}
    >
      <HStack w="100%">
        <SkeletonCircle size="10" />
        <SkeletonText noOfLines={1} width="100px" />
      </HStack>
      <SkeletonText flex="1" w="100%" noOfLines={4} spacing={3} />
      <HStack w="100%" justify="space-between">
        <Skeleton width="60px" height="20px" />
        <Skeleton width="80px" height="20px" />
      </HStack>
    </VStack>
  );

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
        position="fixed"
        left="0"
        top="0"
        height="100vh"
        overflowY="auto"
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
      <Flex 
        flex="1" 
        justifyContent="center" 
        p={mainPadding} 
        ml={{ base: 0, lg: "250px" }}
      >
        <VStack w="95%" maxW="600px" alignItems="start" gap="20px" mt={{ base: "60px", lg: "50px" }} pb="50px">
          <Heading>Posts</Heading>
          
          {error && (
            <Box w="100%" p={4} bg="red.50" border="1px solid" borderColor="red.200" borderRadius="md">
              <Text color="red.600">{error}</Text>
              <Button 
                mt={2} 
                colorScheme="red" 
                size="sm" 
                onClick={() => fetchPosts(1, false)}
              >
                Retry
              </Button>
            </Box>
          )}

          {loading ? (
            // Show skeleton loaders for initial load
            <VStack w="100%" spacing={4}>
              {[...Array(3)].map((_, index) => (
                <PostSkeleton key={index} />
              ))}
            </VStack>
          ) : posts.length > 0 ? (
            <>
              {/* Show actual posts */}
              {posts.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  username={post.username}
                  description={post.description}
                  formatted_date={post.formatted_date}
                  liked={post.liked}
                  like_count={post.like_count}
                />
              ))}
              
              {/* Load more section */}
              {hasMore && (
                <Flex w="100%" justify="center" mt={4}>
                  {loadingMore ? (
                    <VStack spacing={4}>
                      <PostSkeleton />
                      <Text color="gray.500">Loading more posts...</Text>
                    </VStack>
                  ) : (
                    <Button onClick={loadMorePosts} colorScheme="blue">
                      Load More Posts
                    </Button>
                  )}
                </Flex>
              )}
            </>
          ) : (
            <Box w="100%" textAlign="center" py={10}>
              <Text color="gray.500" fontSize="lg">
                No posts found
              </Text>
              <Text color="gray.400" mt={2}>
                Be the first to create a post!
              </Text>
            </Box>
          )}
        </VStack>
      </Flex>
    </Flex>
  );
};

// ... Sidebar component remains the same as your original code



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

export default Home;