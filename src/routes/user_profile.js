// import {
//   Text,
//   VStack,
//   Flex,
//   Box,
//   Heading,
//   HStack,
//   Image,
//   Button,
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
//   Grid,
//   GridItem,
//   Container
// } from "@chakra-ui/react";
// import { useState, useEffect } from "react";
// import {
//   get_user_profile_data,
//   get_users_posts,
//   toggleFollow,

// } from "../api/endpoints";
// import { SERVER_URL } from "../constants/constants";
// import Post from "../components/post";

// const UserProfile = () => {
//   const get_username_from_url = () => {
//     const url_split = window.location.pathname.split("/");
//     return url_split[url_split.length - 1];
//   };

//   const [username, setUsername] = useState(get_username_from_url());
//   const [isMyProfile, setIsMyProfile] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const { isOpen, onOpen, onClose } = useDisclosure();
  
//   // Responsive values
//   const sidebarDisplay = useBreakpointValue({ 
//     base: "none", 
//     md: "none", 
//     lg: "block" 
//   });
  
//   const mainContentWidth = useBreakpointValue({ 
//     base: "100%", 
//     md: "95%", 
//     lg: "85%", 
//     xl: "75%" 
//   });
  
//   const containerMaxWidth = useBreakpointValue({ 
//     base: "100%", 
//     md: "768px", 
//     lg: "1024px", 
//     xl: "1200px" 
//   });
  
//   const padding = useBreakpointValue({ 
//     base: "10px", 
//     md: "15px", 
//     lg: "20px" 
//   });

//   const mobileHeaderHeight = "60px";

//   useEffect(() => {
//     const urlUsername = get_username_from_url();
//     setUsername(urlUsername);
    
//     // Check if this is the current user's profile
//     const userData = localStorage.getItem("userData");
//     if (userData) {
//       const currentUserData = JSON.parse(userData);
//       setCurrentUser(currentUserData);
//       setIsMyProfile(currentUserData.username === urlUsername);
//     }
//   }, []);

//   return (
//     <Flex w="100%" minH="100vh" bg="gray.50">
//       {/* Mobile Header */}
//       <Box
//         display={{ base: "flex", lg: "none" }}
//         position="fixed"
//         top="0"
//         left="0"
//         right="0"
//         height={mobileHeaderHeight}
//         bg="white"
//         borderBottom="1px solid"
//         borderColor="gray.200"
//         zIndex="1000"
//         alignItems="center"
//         px="15px"
//         boxShadow="sm"
//       >
//         <IconButton
//           aria-label="Open menu"
//           icon="☰"
//           onClick={onOpen}
//           variant="ghost"
//           size="sm"
//           mr="10px"
//         />
//         <Heading size="md" color="blue.600">
//           PhiBook
//         </Heading>
//         <Spacer />
//         {isMyProfile && (
//           <Button 
//             size="sm" 
//             colorScheme="blue"
//             onClick={() => window.location.href = '/create/post'}
//           >
//             New Post
//           </Button>
//         )}
//       </Box>

//       {/* Left Sidebar - Desktop */}
//       <Box 
//         w="280px" 
//         bg="white" 
//         p="25px" 
//         borderRight="1px solid" 
//         borderColor="gray.200"
//         display={sidebarDisplay}
//         position="fixed"
//         left="0"
//         top="0"
//         height="100vh"
//         overflowY="auto"
//         boxShadow="sm"
//       >
//         <Sidebar currentUser={currentUser} />
//       </Box>
      
//       {/* Mobile Sidebar Drawer */}
//       <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
//         <DrawerOverlay />
//         <DrawerContent>
//           <DrawerCloseButton />
//           <DrawerHeader bg="blue.600" color="white">
//             PhiBook
//           </DrawerHeader>
//           <DrawerBody p="0">
//             <Sidebar currentUser={currentUser} onItemClick={onClose} />
//           </DrawerBody>
//         </DrawerContent>
//       </Drawer>
      
//       {/* Main Content */}
//       <Flex 
//         flex="1" 
//         justifyContent="center" 
//         p={padding} 
//         ml={{ base: 0, lg: "280px" }}
//         pt={{ base: mobileHeaderHeight, lg: padding }}
//       >
//         <Container 
//           maxW={containerMaxWidth} 
//           p="0" 
//           display="flex" 
//           justifyContent="center"
//         >
//           <VStack 
//             w={mainContentWidth} 
//             maxW="100%" 
//             spacing={{ base: "20px", md: "30px", lg: "40px" }}
//           >
//             <Box w="100%">
//               <UserDetails 
//                 username={username} 
//                 isMyProfile={isMyProfile} 
//                 currentUser={currentUser} 
//               />
//             </Box>
//             <Box w="100%">
//               <UserPosts 
//                 username={username} 
//                 isMyProfile={isMyProfile} 
//               />
//             </Box>
//           </VStack>
//         </Container>
//       </Flex>
//     </Flex>
//   );
// };

// // Sidebar Component
// const Sidebar = ({ currentUser, onItemClick }) => {
//   const buttonSize = useBreakpointValue({ base: "md", lg: "sm" });
//   const headingSize = useBreakpointValue({ base: "xl", lg: "lg" });

//   const menuItems = [
//     { label: "Home", icon: "🏠", path: "/" },
//     { label: "Search", icon: "🔍", path: "/search" },
//     { label: "Create Post", icon: "✏️", path: "/create/post" },
//     { label: "My Posts", icon: "📝", path: `/user/${currentUser?.username || ''}` },
//     { label: "Settings", icon: "⚙️", path: "/settings" },
//   ];

//   const handleItemClick = (path) => {
//     if (onItemClick) {
//       onItemClick();
//     }
//     if (currentUser && path.includes('/user/') && !currentUser.username) {
//       return;
//     }
//     window.location.href = path;
//   };

//   return (
//     <VStack align="start" spacing={{ base: "25px", lg: "20px" }} h="100%">
//       <Heading 
//         size={headingSize} 
//         mb={{ base: "40px", lg: "30px" }} 
//         color="blue.600" 
//         display={{ base: "block", lg: "block" }}
//       >
//         PhiBook
//       </Heading>
      
//       {menuItems.map((item, index) => (
//         <Button
//           key={index}
//           variant="ghost"
//           justifyContent="start"
//           w="100%"
//           p={{ base: "15px 20px", lg: "12px 15px" }}
//           borderRadius="12px"
//           _hover={{ bg: "blue.50", color: "blue.600", transform: "translateX(5px)" }}
//           _active={{ bg: "blue.100" }}
//           transition="all 0.2s"
//           onClick={() => handleItemClick(item.path)}
//           isDisabled={item.path.includes('/user/') && !currentUser?.username}
//           size={buttonSize}
//         >
//           <HStack spacing={{ base: "20px", lg: "15px" }}>
//             <Text fontSize={{ base: "20px", lg: "18px" }}>{item.icon}</Text>
//             <Text fontWeight="medium" fontSize={{ base: "16px", lg: "14px" }}>
//               {item.label}
//             </Text>
//           </HStack>
//         </Button>
//       ))}
      
//       <Spacer />
      
//       {/* User info section */}
//       <Box 
//         mt="auto" 
//         pt="25px" 
//         borderTop="1px solid" 
//         borderColor="gray.200" 
//         w="100%"
//         pb="10px"
//       >
//         <HStack spacing="15px">
//           <Avatar
//             size={{ base: "md", lg: "sm" }}
//             name={currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "User"}
//             src={currentUser?.profile_image}
//             bg="blue.100"
//           />
//           <VStack align="start" spacing="1px" flex="1">
//             <Text fontWeight="bold" fontSize={{ base: "15px", lg: "13px" }} lineHeight="1.2">
//               {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "Current User"}
//             </Text>
//             <Text fontSize={{ base: "13px", lg: "11px" }} color="gray.600" lineHeight="1.2">
//               @{currentUser ? currentUser.username : "username"}
//             </Text>
//           </VStack>
//         </HStack>
//       </Box>
//     </VStack>
//   );
// };

// const UserDetails = ({ username, isMyProfile, currentUser }) => {
//   const [loading, setLoading] = useState(true);
//   const [bio, setBio] = useState("");
//   const [profileImage, setProfileImage] = useState("");
//   const [followerCount, setFollowerCount] = useState(0);
//   const [followingCount, setFollowingCount] = useState(0);
//   const [following, setFollowing] = useState(false);

//   // Responsive values
//   const profileImageSize = useBreakpointValue({ 
//     base: "120px", 
//     sm: "140px", 
//     md: "160px", 
//     lg: "150px" 
//   });
  
//   const headingSize = useBreakpointValue({ 
//     base: "xl", 
//     md: "2xl", 
//     lg: "xl" 
//   });
  
//   const bioFontSize = useBreakpointValue({ 
//     base: "16px", 
//     md: "18px", 
//     lg: "16px" 
//   });
  
//   const statsFontSize = useBreakpointValue({ 
//     base: "14px", 
//     md: "16px", 
//     lg: "14px" 
//   });
  
//   const buttonSize = useBreakpointValue({ 
//     base: "md", 
//     md: "lg", 
//     lg: "md" 
//   });

//   const handleToggleFollow = async () => {
//     const data = await toggleFollow(username);
//     if (data.now_following) {
//       setFollowerCount(followerCount + 1);
//       setFollowing(true);
//     } else {
//       setFollowerCount(followerCount - 1);
//       setFollowing(false);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await get_user_profile_data(username);
//         setBio(data.bio);
//         setProfileImage(data.profile_image);
//         setFollowerCount(data.follower_count);
//         setFollowingCount(data.following_count);
//         setFollowing(data.following);
//       } catch {
//         console.log("error fetching user data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [username]);

//   return (
//     <Box 
//       w="100%" 
//       bg="white" 
//       borderRadius={{ base: "16px", md: "20px" }}
//       p={{ base: "20px", md: "30px", lg: "25px" }}
//       boxShadow="sm"
//       border="1px solid"
//       borderColor="gray.100"
//     >
//       <VStack w="100%" alignItems="start" spacing={{ base: "25px", md: "35px", lg: "30px" }}>
//         {/* Header Section */}
//         <Flex 
//           w="100%" 
//           direction={{ base: "column", sm: "row" }}
//           justify="space-between" 
//           align={{ base: "start", sm: "center" }}
//           gap="15px"
//         >
//           <Heading 
//             size={headingSize} 
//             color="gray.800"
//             wordBreak="break-all"
//           >
//             @{username}
//           </Heading>
//           {isMyProfile && (
//             <Button 
//               colorScheme="blue" 
//               onClick={() => window.location.href = '/create/post'}
//               size={buttonSize}
//               w={{ base: "100%", sm: "auto" }}
//             >
//               Create New Post
//             </Button>
//           )}
//         </Flex>
        
//         {/* Profile Info Section */}
//         <Grid 
//           w="100%"
//           templateColumns={{ 
//             base: "1fr", 
//             sm: "auto 1fr",
//             lg: "auto 1fr" 
//           }}
//           gap={{ base: "20px", md: "30px", lg: "25px" }}
//           alignItems="start"
//         >
//           {/* Profile Image */}
//           <GridItem justifySelf={{ base: "center", sm: "start" }}>
//             <Box
//               boxSize={profileImageSize}
//               border="3px solid"
//               borderColor="blue.100"
//               bg="white"
//               borderRadius="full"
//               overflow="hidden"
//               flexShrink={0}
//               boxShadow="md"
//             >
//               <Image
//                 src={loading ? "" : `${SERVER_URL}${profileImage}`}
//                 boxSize="100%"
//                 objectFit="cover"
//                 fallbackSrc="https://via.placeholder.com/150?text=No+Image"
//                 alt={`${username}'s profile`}
//               />
//             </Box>
//           </GridItem>
          
//           {/* Profile Details */}
//           <GridItem>
//             <VStack 
//               spacing={{ base: "20px", md: "25px" }} 
//               align={{ base: "center", sm: "start" }} 
//               w="100%"
//             >
//               {/* Stats */}
//               <HStack 
//                 spacing={{ base: "25px", md: "35px", lg: "30px" }} 
//                 fontSize={statsFontSize}
//                 justify={{ base: "center", sm: "start" }}
//                 w="100%"
//                 flexWrap="wrap"
//               >
//                 <VStack spacing="5px">
//                   <Text fontWeight="bold" color="gray.600">Followers</Text>
//                   <Text fontWeight="bold" color="gray.800" fontSize="18px">
//                     {loading ? "-" : followerCount}
//                   </Text>
//                 </VStack>
//                 <VStack spacing="5px">
//                   <Text fontWeight="bold" color="gray.600">Following</Text>
//                   <Text fontWeight="bold" color="gray.800" fontSize="18px">
//                     {loading ? "-" : followingCount}
//                   </Text>
//                 </VStack>
//                 <VStack spacing="5px">
//                   <Text fontWeight="bold" color="gray.600">Posts</Text>
//                   <Text fontWeight="bold" color="gray.800" fontSize="18px">
//                     {loading ? "-" : "..."}
//                   </Text>
//                 </VStack>
//               </HStack>
              
//               {/* Action Buttons */}
//               {!loading && (
//                 isMyProfile ? (
//                   <Button 
//                     w={{ base: "100%", sm: "auto" }}
//                     minW="150px"
//                     onClick={() => window.location.href = "/settings"}
//                     size={buttonSize}
//                     variant="outline"
//                     colorScheme="blue"
//                   >
//                     Edit Profile
//                   </Button>
//                 ) : (
//                   <Button 
//                     onClick={handleToggleFollow} 
//                     colorScheme={following ? "gray" : "blue"} 
//                     w={{ base: "100%", sm: "auto" }}
//                     minW="150px"
//                     size={buttonSize}
//                   >
//                     {following ? "Unfollow" : "Follow"}
//                   </Button>
//                 )
//               )}
//             </VStack>
//           </GridItem>
//         </Grid>
        
//         {/* Bio Section */}
//         <Box w="100%">
//           <Text 
//             fontSize={bioFontSize} 
//             textAlign={{ base: "center", sm: "left" }} 
//             color="gray.700"
//             lineHeight="1.6"
//             px={{ base: "10px", sm: "0" }}
//           >
//             {loading ? "Loading..." : bio || "This user hasn't added a bio yet."}
//           </Text>
//         </Box>
//       </VStack>
//     </Box>
//   );
// };

// const UserPosts = ({ username, isMyProfile }) => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Responsive values
//   const headingSize = useBreakpointValue({ 
//     base: "lg", 
//     md: "xl", 
//     lg: "lg" 
//   });
  
//   const postGap = useBreakpointValue({ 
//     base: "20px", 
//     md: "25px", 
//     lg: "20px" 
//   });

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         let postsData;
//         if (isMyProfile) {
//           const userData = localStorage.getItem("userData");
//           if (userData) {
//             const user = JSON.parse(userData);
//             postsData = await get_users_posts(user.username);
//           }
//         } else {
//           postsData = await get_users_posts(username);
//         }
//         setPosts(postsData || []);
//       } catch (error) {
//         console.error("Error getting posts:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPosts();
//   }, [username, isMyProfile]);

//   return (
//     <Box 
//       w="100%" 
//       bg="white" 
//       borderRadius={{ base: "16px", md: "20px" }}
//       p={{ base: "20px", md: "25px" }}
//       boxShadow="sm"
//       border="1px solid"
//       borderColor="gray.100"
//     >
//       <VStack w="100%" align="start" spacing={{ base: "25px", md: "30px" }}>
//         <Heading size={headingSize} color="gray.800">
//           {isMyProfile ? "My Posts" : "Posts"}
//         </Heading>
        
//         {loading ? (
//           <Flex w="100%" justify="center" py="40px">
//             <VStack spacing="15px">
//               <Text color="gray.500">Loading posts...</Text>
//             </VStack>
//           </Flex>
//         ) : posts.length > 0 ? (
//           <VStack 
//             w="100%" 
//             spacing={postGap}
//             align="stretch"
//           >
//             {posts.map((post) => (
//               <Post
//                 key={post.id}
//                 id={post.id}
//                 username={post.username}
//                 user_profile_image={post.user_profile_image}
//                 description={post.description}
//                 formatted_date={post.formatted_date}
//                 liked={post.liked}
//                 like_count={post.like_count}
//                 comment_count={post.comment_count || 0}
//                 post_type={post.post_type}
//                 image={post.image}
//                 video_url={post.video_url}
//                 youtube_id={post.youtube_id}
//                 link_url={post.link_url}
//                 link_image={post.link_image}
//                 link_title={post.link_title}
//               />
//             ))}
//           </VStack>
//         ) : (
//           <Flex w="100%" justify="center" py="40px">
//             <VStack spacing="20px" textAlign="center">
//               <Text color="gray.500" fontSize="18px">
//                 {isMyProfile 
//                   ? "You haven't created any posts yet" 
//                   : `${username} hasn't created any posts yet`
//                 }
//               </Text>
//               {isMyProfile && (
//                 <Button 
//                   colorScheme="blue" 
//                   onClick={() => window.location.href = '/create/post'}
//                   size="lg"
//                 >
//                   Create Your First Post
//                 </Button>
//               )}
//             </VStack>
//           </Flex>
//         )}
//       </VStack>
//     </Box>
//   );
// };

// export default UserProfile;

import {
  Text,
  VStack,
  Flex,
  Box,
  Heading,
  HStack,
  Button,
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
  Grid,
  GridItem,
  Container
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  get_user_profile_data,
  get_users_posts,
  toggleFollow,
} from "../api/endpoints";
import Post from "../components/post";

const UserProfile = () => {
  const get_username_from_url = () => {
    const url_split = window.location.pathname.split("/");
    return url_split[url_split.length - 1];
  };

  const [username, setUsername] = useState(get_username_from_url());
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Responsive values
  const sidebarDisplay = useBreakpointValue({ 
    base: "none", 
    md: "none", 
    lg: "block" 
  });
  
  const mainContentWidth = useBreakpointValue({ 
    base: "100%", 
    md: "95%", 
    lg: "85%", 
    xl: "75%" 
  });
  
  const containerMaxWidth = useBreakpointValue({ 
    base: "100%", 
    md: "768px", 
    lg: "1024px", 
    xl: "1200px" 
  });
  
  const padding = useBreakpointValue({ 
    base: "10px", 
    md: "15px", 
    lg: "20px" 
  });

  const mobileHeaderHeight = "60px";

  useEffect(() => {
    const urlUsername = get_username_from_url();
    setUsername(urlUsername);
    
    // Check if this is the current user's profile
    const userData = localStorage.getItem("userData");
    if (userData) {
      const currentUserData = JSON.parse(userData);
      setCurrentUser(currentUserData);
      setIsMyProfile(currentUserData.username === urlUsername);
    }
  }, []);

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
        px="15px"
        boxShadow="sm"
      >
        <IconButton
          aria-label="Open menu"
          icon="☰"
          onClick={onOpen}
          variant="ghost"
          size="sm"
          mr="10px"
        />
        <Heading size="md" color="blue.600">
          PhiBook
        </Heading>
        <Spacer />
        {isMyProfile && (
          <Button 
            size="sm" 
            colorScheme="blue"
            onClick={() => window.location.href = '/create/post'}
          >
            New Post
          </Button>
        )}
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
        <Sidebar currentUser={currentUser} />
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
            <Sidebar currentUser={currentUser} onItemClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      
      {/* Main Content */}
      <Flex 
        flex="1" 
        justifyContent="center" 
        p={padding} 
        ml={{ base: 0, lg: "280px" }}
        pt={{ base: mobileHeaderHeight, lg: padding }}
      >
        <Container 
          maxW={containerMaxWidth} 
          p="0" 
          display="flex" 
          justifyContent="center"
        >
          <VStack 
            w={mainContentWidth} 
            maxW="100%" 
            spacing={{ base: "20px", md: "30px", lg: "40px" }}
          >
            <Box w="100%">
              <UserDetails 
                username={username} 
                isMyProfile={isMyProfile} 
                currentUser={currentUser} 
              />
            </Box>
            <Box w="100%">
              <UserPosts 
                username={username} 
                isMyProfile={isMyProfile} 
              />
            </Box>
          </VStack>
        </Container>
      </Flex>
    </Flex>
  );
};

// Sidebar Component
const Sidebar = ({ currentUser, onItemClick }) => {
  const buttonSize = useBreakpointValue({ base: "md", lg: "sm" });
  const headingSize = useBreakpointValue({ base: "xl", lg: "lg" });

  const menuItems = [
    { label: "Home", icon: "🏠", path: "/" },
    { label: "Search", icon: "🔍", path: "/search" },
    { label: "Create Post", icon: "✏️", path: "/create/post" },
    { label: "My Posts", icon: "📝", path: `/user/${currentUser?.username || ''}` },
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

  return (
    <VStack align="start" spacing={{ base: "25px", lg: "20px" }} h="100%">
      <Heading 
        size={headingSize} 
        mb={{ base: "40px", lg: "30px" }} 
        color="blue.600" 
        display={{ base: "block", lg: "block" }}
      >
        PhiBook
      </Heading>
      
      {menuItems.map((item, index) => (
        <Button
          key={index}
          variant="ghost"
          justifyContent="start"
          w="100%"
          p={{ base: "15px 20px", lg: "12px 15px" }}
          borderRadius="12px"
          _hover={{ bg: "blue.50", color: "blue.600", transform: "translateX(5px)" }}
          _active={{ bg: "blue.100" }}
          transition="all 0.2s"
          onClick={() => handleItemClick(item.path)}
          isDisabled={item.path.includes('/user/') && !currentUser?.username}
          size={buttonSize}
        >
          <HStack spacing={{ base: "20px", lg: "15px" }}>
            <Text fontSize={{ base: "20px", lg: "18px" }}>{item.icon}</Text>
            <Text fontWeight="medium" fontSize={{ base: "16px", lg: "14px" }}>
              {item.label}
            </Text>
          </HStack>
        </Button>
      ))}
      
      <Spacer />
      
      {/* User info section */}
      <Box 
        mt="auto" 
        pt="25px" 
        borderTop="1px solid" 
        borderColor="gray.200" 
        w="100%"
        pb="10px"
      >
        <HStack spacing="15px">
          <Avatar
            size={{ base: "md", lg: "sm" }}
            name={currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "User"}
            src={currentUser?.profile_image}
            bg="blue.500"
            color="white"
          />
          <VStack align="start" spacing="1px" flex="1">
            <Text fontWeight="bold" fontSize={{ base: "15px", lg: "13px" }} lineHeight="1.2">
              {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "Current User"}
            </Text>
            <Text fontSize={{ base: "13px", lg: "11px" }} color="gray.600" lineHeight="1.2">
              @{currentUser ? currentUser.username : "username"}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </VStack>
  );
};

const UserDetails = ({ username, isMyProfile, currentUser }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    bio: "",
    profile_image: "",
    follower_count: 0,
    following_count: 0,
    following: false,
    first_name: "",
    last_name: ""
  });

  // Responsive values - REMOVED profileImageSize since it's not used
  const headingSize = useBreakpointValue({ 
    base: "xl", 
    md: "2xl", 
    lg: "xl" 
  });
  
  const bioFontSize = useBreakpointValue({ 
    base: "16px", 
    md: "18px", 
    lg: "16px" 
  });
  
  const statsFontSize = useBreakpointValue({ 
    base: "14px", 
    md: "16px", 
    lg: "14px" 
  });
  
  const buttonSize = useBreakpointValue({ 
    base: "md", 
    md: "lg", 
    lg: "md" 
  });

  // Function to generate background color based on username
  const getAvatarColor = (username) => {
    const colors = [
      "blue.500", "green.500", "purple.500", "orange.500", 
      "red.500", "teal.500", "pink.500", "cyan.500"
    ];
    if (!username) return "blue.500";
    
    // Simple hash function to get consistent color for same username
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const handleToggleFollow = async () => {
    const data = await toggleFollow(username);
    if (data.now_following) {
      setUserData(prev => ({
        ...prev,
        follower_count: prev.follower_count + 1,
        following: true
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        follower_count: prev.follower_count - 1,
        following: false
      }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get_user_profile_data(username);
        setUserData({
          bio: data.bio || "",
          profile_image: data.profile_image || "",
          follower_count: data.follower_count || 0,
          following_count: data.following_count || 0,
          following: data.following || false,
          first_name: data.first_name || "",
          last_name: data.last_name || ""
        });
      } catch {
        console.log("error fetching user data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  // Get user initials
  const getUserInitials = () => {
    if (loading) return "U";
    const first = userData.first_name?.[0] || "";
    const last = userData.last_name?.[0] || "";
    return (first + last).toUpperCase() || username?.[0]?.toUpperCase() || "U";
  };

  return (
    <Box 
      w="100%" 
      bg="white" 
      borderRadius={{ base: "16px", md: "20px" }}
      p={{ base: "20px", md: "30px", lg: "25px" }}
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
    >
      <VStack w="100%" alignItems="start" spacing={{ base: "25px", md: "35px", lg: "30px" }}>
        {/* Header Section */}
        <Flex 
          w="100%" 
          direction={{ base: "column", sm: "row" }}
          justify="space-between" 
          align={{ base: "start", sm: "center" }}
          gap="15px"
        >
          <Heading 
            size={headingSize} 
            color="gray.800"
            wordBreak="break-all"
          >
            @{username}
          </Heading>
          {isMyProfile && (
            <Button 
              colorScheme="blue" 
              onClick={() => window.location.href = '/create/post'}
              size={buttonSize}
              w={{ base: "100%", sm: "auto" }}
            >
              Create New Post
            </Button>
          )}
        </Flex>
        
        {/* Profile Info Section */}
        <Grid 
          w="100%"
          templateColumns={{ 
            base: "1fr", 
            sm: "auto 1fr",
            lg: "auto 1fr" 
          }}
          gap={{ base: "20px", md: "30px", lg: "25px" }}
          alignItems="start"
        >
          {/* Profile Image */}
          <GridItem justifySelf={{ base: "center", sm: "start" }}>
            <Avatar
              size="2xl"
              name={`${userData.first_name} ${userData.last_name}`}
              src={userData.profile_image}
              bg={getAvatarColor(username)}
              color="white"
              border="3px solid"
              borderColor="blue.100"
              boxShadow="md"
              fontSize="48px"
              fontWeight="bold"
            >
              {getUserInitials()}
            </Avatar>
          </GridItem>
          
          {/* Profile Details */}
          <GridItem>
            <VStack 
              spacing={{ base: "20px", md: "25px" }} 
              align={{ base: "center", sm: "start" }} 
              w="100%"
            >
              {/* Stats */}
              <HStack 
                spacing={{ base: "25px", md: "35px", lg: "30px" }} 
                fontSize={statsFontSize}
                justify={{ base: "center", sm: "start" }}
                w="100%"
                flexWrap="wrap"
              >
                <VStack spacing="5px">
                  <Text fontWeight="bold" color="gray.600">Followers</Text>
                  <Text fontWeight="bold" color="gray.800" fontSize="18px">
                    {loading ? "-" : userData.follower_count}
                  </Text>
                </VStack>
                <VStack spacing="5px">
                  <Text fontWeight="bold" color="gray.600">Following</Text>
                  <Text fontWeight="bold" color="gray.800" fontSize="18px">
                    {loading ? "-" : userData.following_count}
                  </Text>
                </VStack>
                <VStack spacing="5px">
                  <Text fontWeight="bold" color="gray.600">Posts</Text>
                  <Text fontWeight="bold" color="gray.800" fontSize="18px">
                    {loading ? "-" : "..."}
                  </Text>
                </VStack>
              </HStack>
              
              {/* Action Buttons */}
              {!loading && (
                isMyProfile ? (
                  <Button 
                    w={{ base: "100%", sm: "auto" }}
                    minW="150px"
                    onClick={() => window.location.href = "/settings"}
                    size={buttonSize}
                    variant="outline"
                    colorScheme="blue"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Button 
                    onClick={handleToggleFollow} 
                    colorScheme={userData.following ? "gray" : "blue"} 
                    w={{ base: "100%", sm: "auto" }}
                    minW="150px"
                    size={buttonSize}
                  >
                    {userData.following ? "Unfollow" : "Follow"}
                  </Button>
                )
              )}
            </VStack>
          </GridItem>
        </Grid>
        
        {/* Bio Section */}
        <Box w="100%">
          <Text 
            fontSize={bioFontSize} 
            textAlign={{ base: "center", sm: "left" }} 
            color="gray.700"
            lineHeight="1.6"
            px={{ base: "10px", sm: "0" }}
          >
            {loading ? "Loading..." : userData.bio || "This user hasn't added a bio yet."}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

const UserPosts = ({ username, isMyProfile }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Responsive values
  const headingSize = useBreakpointValue({ 
    base: "lg", 
    md: "xl", 
    lg: "lg" 
  });
  
  const postGap = useBreakpointValue({ 
    base: "20px", 
    md: "25px", 
    lg: "20px" 
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let postsData;
        if (isMyProfile) {
          const userData = localStorage.getItem("userData");
          if (userData) {
            const user = JSON.parse(userData);
            postsData = await get_users_posts(user.username);
          }
        } else {
          postsData = await get_users_posts(username);
        }
        setPosts(postsData || []);
      } catch (error) {
        console.error("Error getting posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [username, isMyProfile]);

  return (
    <Box 
      w="100%" 
      bg="white" 
      borderRadius={{ base: "16px", md: "20px" }}
      p={{ base: "20px", md: "25px" }}
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
    >
      <VStack w="100%" align="start" spacing={{ base: "25px", md: "30px" }}>
        <Heading size={headingSize} color="gray.800">
          {isMyProfile ? "My Posts" : "Posts"}
        </Heading>
        
        {loading ? (
          <Flex w="100%" justify="center" py="40px">
            <VStack spacing="15px">
              <Text color="gray.500">Loading posts...</Text>
            </VStack>
          </Flex>
        ) : posts.length > 0 ? (
          <VStack 
            w="100%" 
            spacing={postGap}
            align="stretch"
          >
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
        ) : (
          <Flex w="100%" justify="center" py="40px">
            <VStack spacing="20px" textAlign="center">
              <Text color="gray.500" fontSize="18px">
                {isMyProfile 
                  ? "You haven't created any posts yet" 
                  : `${username} hasn't created any posts yet`
                }
              </Text>
              {isMyProfile && (
                <Button 
                  colorScheme="blue" 
                  onClick={() => window.location.href = '/create/post'}
                  size="lg"
                >
                  Create Your First Post
                </Button>
              )}
            </VStack>
          </Flex>
        )}
      </VStack>
    </Box>
  );
};

export default UserProfile;