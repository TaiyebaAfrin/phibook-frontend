// import { 
//   Heading, 
//   VStack, 
//   Text, 
//   Flex, 
//   Button,
//   Box,
//   HStack,
//   Spacer,
//   useBreakpointValue,
//   Drawer,
//   DrawerBody,
//   DrawerHeader,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerCloseButton,
//   IconButton,
//   useDisclosure,
//   Avatar,
//   useToast
// } from "@chakra-ui/react";
// import { useEffect, useState, useCallback } from "react";
// import { get_posts } from "../api/endpoints";
// import Post from "../components/post";

// const Home = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [nextPage, setNextPage] = useState(null);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const toast = useToast();
  
//   // Responsive values
//   const sidebarDisplay = useBreakpointValue({ base: "none", lg: "block" });
//   const mainPadding = useBreakpointValue({ base: "10px", md: "20px" });

//   // Fetch initial data function
//   const fetchInitialData = useCallback(async () => {
//     try {
//       const data = await get_posts();
      
//       // Handle paginated response structure
//       if (data && data.results) {
//         // If backend returns paginated data
//         setPosts(data.results);
//         setNextPage(data.next ? 1 : null); // Fixed: use functional update
//       } else if (Array.isArray(data)) {
//         // If backend returns direct array
//         setPosts(data);
//         setNextPage(null);
//       } else {
//         setPosts([]);
//       }
//     } catch (error) {
//       console.error("Error getting posts:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load posts",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [toast]); // Add toast as dependency

//   // Load initial data on component mount
//   useEffect(() => {
//     fetchInitialData();
//   }, [fetchInitialData]); // Add fetchInitialData as dependency

//   const loadMorePosts = async () => {
//     if (nextPage && !loadingMore) {
//       setLoadingMore(true);
//       try {
//         const data = await get_posts(nextPage);
//         if (data.results) {
//           setPosts(prevPosts => [...prevPosts, ...data.results]);
//           // Use functional update for nextPage
//           setNextPage(prevPage => data.next ? prevPage + 1 : null);
//         }
//       } catch (error) {
//         console.error("Error getting more posts:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load more posts",
//           status: "error",
//           duration: 3000,
//           isClosable: true,
//         });
//       } finally {
//         setLoadingMore(false);
//       }
//     }
//   };

//   return (
//     <Flex w="100%" minH="100vh">
//       {/* Mobile Menu Button */}
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

//       {/* Left Sidebar - Desktop */}
//       <Box 
//         w="250px" 
//         bg="gray.50" 
//         p="20px" 
//         borderRight="1px solid" 
//         borderColor="gray.200"
//         display={sidebarDisplay}
//         position="fixed"
//         left="0"
//         top="0"
//         height="100vh"
//         overflowY="auto"
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
//       <Flex 
//         flex="1" 
//         justifyContent="center" 
//         p={mainPadding} 
//         ml={{ base: 0, lg: "250px" }}
//       >
//         <VStack w="95%" maxW="600px" alignItems="start" gap="20px" mt={{ base: "60px", lg: "50px" }} pb="50px">
//           <Heading></Heading>
          
//           {loading ? (
//             <VStack w="100%" py="40px">
//               <Text>Loading posts...</Text>
//             </VStack>
//           ) : posts.length > 0 ? (
//             <>
//               {posts.map((post) => (
//                 <Post
//                   key={post.id}
//                   id={post.id}
//                   username={post.username}
//                   description={post.description}
//                   formatted_date={post.formatted_date}
//                   liked={post.liked}
//                   like_count={post.like_count}
//                   comment_count={post.comment_count || 0}
//                 />
//               ))}
              
//               {nextPage && (
//                 <Button 
//                   onClick={loadMorePosts} 
//                   w="100%" 
//                   isLoading={loadingMore}
//                   loadingText="Loading more posts..."
//                 >
//                   Load More
//                 </Button>
//               )}
//             </>
//           ) : (
//             <VStack w="100%" py="40px" spacing={4}>
//               <Text color="gray.500" textAlign="center">
//                 No posts found
//               </Text>
//               <Button 
//                 colorScheme="blue" 
//                 onClick={() => window.location.href = '/create/post'}
//               >
//                 Create Your First Post
//               </Button>
//             </VStack>
//           )}
//         </VStack>
//       </Flex>
//     </Flex>
//   );
// };

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
//     { label: "Profile", icon: "👤", path: "/settings" },
//     { label: "Settings", icon: "⚙️", path: "/settings" },
//   ];

//   const handleItemClick = (path) => {
//     if (onItemClick) {
//       onItemClick();
//     }
//     if (currentUser && path.includes('/user/') && !currentUser.username) {
//       return; // Don't navigate if no username
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
//           isDisabled={item.path.includes('/user/') && !currentUser?.username}
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
//           <Avatar
//             size="sm"
//             name={currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "User"}
//             src={currentUser?.profile_image}
//           />
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

// export default Home;

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
  Avatar,
  useToast,
  Container
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { get_posts } from "../api/endpoints";
import Post from "../components/post";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  // Responsive values
  const sidebarDisplay = useBreakpointValue({ 
    base: "none", 
    md: "none", 
    lg: "block" 
  });
  
  const mainPadding = useBreakpointValue({ 
    base: "15px", 
    md: "25px", 
    lg: "30px" 
  });
  
  const containerMaxWidth = useBreakpointValue({ 
    base: "100%", 
    md: "600px", 
    lg: "800px" 
  });

  const mobileHeaderHeight = "70px";

  // Fetch initial data function
  const fetchInitialData = useCallback(async () => {
    try {
      const data = await get_posts();
      
      // Handle paginated response structure
      if (data && data.results) {
        // If backend returns paginated data
        setPosts(data.results);
        setNextPage(data.next ? 1 : null);
      } else if (Array.isArray(data)) {
        // If backend returns direct array
        setPosts(data);
        setNextPage(null);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error getting posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load initial data on component mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const loadMorePosts = async () => {
    if (nextPage && !loadingMore) {
      setLoadingMore(true);
      try {
        const data = await get_posts(nextPage);
        if (data.results) {
          setPosts(prevPosts => [...prevPosts, ...data.results]);
          setNextPage(prevPage => data.next ? prevPage + 1 : null);
        }
      } catch (error) {
        console.error("Error getting more posts:", error);
        toast({
          title: "Error",
          description: "Failed to load more posts",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoadingMore(false);
      }
    }
  };

  return (
    <Flex w="100%" minH="100vh" bg="gray.50">
      {/* Mobile Header */}
      <Box
        display={{ base: "flex", lg: "none" }}
        position="fixed"
        top="0"
        left="0"
        right="0"
        height={mobileHeaderHeight}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        zIndex="1000"
        alignItems="center"
        px="20px"
        boxShadow="sm"
      >
        <IconButton
          aria-label="Open menu"
          icon="☰"
          onClick={onOpen}
          variant="ghost"
          size="sm"
          mr="15px"
        />
        <Heading size="md" color="blue.600">
          Home
        </Heading>
        <Spacer />
        <Button 
          size="sm" 
          colorScheme="blue"
          onClick={() => window.location.href = '/create/post'}
        >
          New Post
        </Button>
      </Box>

      {/* Left Sidebar - Desktop */}
      <Box 
        w="280px" 
        bg="white" 
        p="25px" 
        borderRight="1px solid" 
        borderColor="gray.200"
        display={sidebarDisplay}
        position="fixed"
        left="0"
        top="0"
        height="100vh"
        overflowY="auto"
        boxShadow="sm"
      >
        <Sidebar />
      </Box>
      
      {/* Mobile Sidebar Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader bg="blue.600" color="white">
            PhiBook
          </DrawerHeader>
          <DrawerBody p="0">
            <Sidebar onItemClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      
      {/* Main Content */}
      <Flex 
        flex="1" 
        justifyContent="center" 
        p={mainPadding} 
        ml={{ base: 0, lg: "280px" }}
        pt={{ base: mobileHeaderHeight, lg: mainPadding }}
      >
        <Container maxW={containerMaxWidth} p="0">
          <VStack spacing={{ base: "25px", md: "30px" }} align="stretch">
            {/* Header */}
            <Box display={{ base: "none", lg: "block" }}>
              <Heading size="xl" color="gray.800" mb="10px">
                Home Feed
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Discover the latest posts from your network
              </Text>
            </Box>
          
            {loading ? (
              <VStack w="100%" py="40px" spacing="20px">
                <Text color="gray.500" fontSize="lg">Loading posts...</Text>
              </VStack>
            ) : posts.length > 0 ? (
              <>
                <VStack spacing={{ base: "20px", md: "25px" }} align="stretch">
                  {posts.map((post) => (
                    <Post
                      key={post.id}
                      id={post.id}
                      username={post.username}
                      user_profile_image={post.user_profile_image}
                      description={post.description}
                      formatted_date={post.formatted_date}
                      liked={post.liked}
                      like_count={post.like_count}
                      comment_count={post.comment_count || 0}
                      post_type={post.post_type}
                      image={post.image}
                      video_url={post.video_url}
                      youtube_id={post.youtube_id}
                      link_url={post.link_url}
                      link_image={post.link_image}
                      link_title={post.link_title}
                    />
                  ))}
                </VStack>
                
                {nextPage && (
                  <Box pt="20px">
                    <Button 
                      onClick={loadMorePosts} 
                      w="100%" 
                      isLoading={loadingMore}
                      loadingText="Loading more posts..."
                      size="lg"
                      borderRadius="12px"
                      colorScheme="blue"
                      variant="outline"
                    >
                      Load More Posts
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <VStack w="100%" py="60px" spacing="25px" textAlign="center">
                <Box>
                  <Text color="gray.500" fontSize="xl" mb="10px">
                    No posts yet
                  </Text>
                  <Text color="gray.400" fontSize="md">
                    Be the first to share something amazing!
                  </Text>
                </Box>
                <Button 
                  colorScheme="blue" 
                  onClick={() => window.location.href = '/create/post'}
                  size="lg"
                  px="30px"
                >
                  Create Your First Post
                </Button>
              </VStack>
            )}
          </VStack>
        </Container>
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
    { label: "Home", icon: "🏠", path: "/", isActive: true },
    { label: "Search", icon: "🔍", path: "/search" },
    { label: "Create Post", icon: "✏️", path: "/create/post" },
    { label: "My Profile", icon: "👤", path: `/user/${currentUser?.username || ''}` },
    { label: "Settings", icon: "⚙️", path: "/settings" },
  ];

  const handleItemClick = (path) => {
    if (onItemClick) {
      onItemClick();
    }
    if (currentUser && path.includes('/user/') && !currentUser.username) {
      return;
    }
    window.location.href = path;
  };

  // Function to generate background color based on username
  const getAvatarColor = (username) => {
    const colors = [
      "blue.500", "green.500", "purple.500", "orange.500", 
      "red.500", "teal.500", "pink.500", "cyan.500"
    ];
    if (!username) return "blue.500";
    
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Get user initials
  const getUserInitials = () => {
    if (!currentUser) return "U";
    const first = currentUser.first_name?.[0] || "";
    const last = currentUser.last_name?.[0] || "";
    return (first + last).toUpperCase() || currentUser.username?.[0]?.toUpperCase() || "U";
  };

  return (
    <VStack align="start" spacing="20px" h="100%">
      <Heading size="lg" mb="30px" color="blue.600" display={{ base: "none", lg: "block" }}>
        PhiBook
      </Heading>
      
      {menuItems.map((item, index) => (
        <Button
          key={index}
          variant={item.isActive ? "solid" : "ghost"}
          colorScheme={item.isActive ? "blue" : "gray"}
          justifyContent="start"
          w="100%"
          p="10px 15px"
          borderRadius="10px"
          _hover={!item.isActive ? { 
            bg: "blue.50", 
            color: "blue.600",
            transform: "translateX(5px)" 
          } : {}}
          transition="all 0.2s"
          onClick={() => handleItemClick(item.path)}
          isDisabled={item.path.includes('/user/') && !currentUser?.username}
        >
          <HStack spacing="15px">
            <Text fontSize="18px">{item.icon}</Text>
            <Text fontWeight="medium">{item.label}</Text>
          </HStack>
        </Button>
      ))}
      
      <Spacer />
      
      {/* User info section */}
      <Box 
        mt="auto" 
        pt="20px" 
        borderTop="1px solid" 
        borderColor="gray.200" 
        w="100%"
      >
        <HStack spacing="15px">
          <Avatar
            size="sm"
            name={currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "User"}
            src={currentUser?.profile_image}
            bg={getAvatarColor(currentUser?.username)}
            color="white"
          >
            {getUserInitials()}
          </Avatar>
          <VStack align="start" spacing="1px" flex="1">
            <Text fontWeight="bold" fontSize="14px" lineHeight="1.2">
              {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "Current User"}
            </Text>
            <Text fontSize="12px" color="gray.600" lineHeight="1.2">
              @{currentUser ? currentUser.username : "username"}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </VStack>
  );
};

export default Home;