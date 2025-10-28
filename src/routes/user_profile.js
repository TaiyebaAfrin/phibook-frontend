import {
  Text,
  VStack,
  Flex,
  Box,
  Heading,
  HStack,
  Image,
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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  get_user_profile_data,
  get_users_posts,
  toggleFollow,
} from "../api/endpoints";
import { SERVER_URL } from "../constants/constants";
import Post from "../components/post";

const UserProfile = () => {
  const get_username_from_url = () => {
    const url_split = window.location.pathname.split("/");
    return url_split[url_split.length - 1];
  };

  const [username, setUsername] = useState(get_username_from_url());
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Responsive values
  const sidebarDisplay = useBreakpointValue({ base: "none", lg: "block" });
  const mainContentWidth = useBreakpointValue({ base: "100%", lg: "75%" });
  const padding = useBreakpointValue({ base: "10px", md: "20px" });

  useEffect(() => {
    setUsername(get_username_from_url());
  }, []);

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
      <Flex flex="1" justifyContent="center" p={padding} ml={{ base: 0, lg: 0 }}>
        <VStack w={mainContentWidth} mt={{ base: "60px", lg: "0" }}>
          <Box w="100%" mt={{ base: "20px", lg: "40px" }}>
            <UserDetails username={username} />
          </Box>
          <Box w="100%" mt={{ base: "30px", lg: "50px" }}>
            <UserPosts username={username} />
          </Box>
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
    { label: "Messages", icon: "💬", path: "/messages" },
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

const UserDetails = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [isOurProfile, setIsOurProfile] = useState(false);
  const [following, setFollowing] = useState(false);

  // Responsive values
  const profileImageSize = useBreakpointValue({ base: "100px", md: "150px" });
  const headingSize = useBreakpointValue({ base: "lg", md: "xl" });
  const bioFontSize = useBreakpointValue({ base: "16px", md: "18px" });

  const handleToggleFollow = async () => {
    const data = await toggleFollow(username);
    if (data.now_following) {
      setFollowerCount(followerCount + 1);
      setFollowing(true);
    } else {
      setFollowerCount(followerCount - 1);
      setFollowing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get_user_profile_data(username);
        setBio(data.bio);
        setProfileImage(data.profile_image);
        setFollowerCount(data.follower_count);
        setFollowingCount(data.following_count);

        setIsOurProfile(data.is_our_profile);
        setFollowing(data.following);
      } catch {
        console.log("error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  return (
    <VStack w="100%" alignItems="start" gap={{ base: "20px", md: "40px" }}>
      <Heading size={headingSize}>@{username}</Heading>
      
      <Flex 
        direction={{ base: "column", md: "row" }} 
        gap="20px" 
        w="100%"
        align={{ base: "center", md: "start" }}
      >
        <Box
          boxSize={profileImageSize}
          border="2px solid"
          borderColor="gray.700"
          bg="white"
          borderRadius="full"
          overflow="hidden"
          flexShrink={0}
        >
          <Image
            src={loading ? "" : `${SERVER_URL}${profileImage}`}
            boxSize="100%"
            objectFit="cover"
          />
        </Box>
        
        <VStack gap="20px" align={{ base: "center", md: "start" }} w={{ base: "100%", md: "auto" }}>
          <HStack gap="20px" fontSize={{ base: "16px", md: "18px" }} justify={{ base: "center", md: "start" }}>
            <VStack>
              <Text>Followers</Text>
              <Text fontWeight="bold">{loading ? "-" : followerCount}</Text>
            </VStack>
            <VStack>
              <Text>Following</Text>
              <Text fontWeight="bold">{loading ? "-" : followingCount}</Text>
            </VStack>
          </HStack>
          
          {loading ? (
            <Spacer />
          ) : isOurProfile ? (
            <Button 
              w={{ base: "100%", md: "auto" }} 
              minW="150px"
              onClick={() => window.location.href = "/settings"}
            >
              Edit Profile
            </Button>
          ) : (
            <Button 
              onClick={handleToggleFollow} 
              colorScheme="blue" 
              w={{ base: "100%", md: "auto" }}
              minW="150px"
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
          )}
        </VStack>
      </Flex>
      
      <Text fontSize={bioFontSize} textAlign={{ base: "center", md: "left" }} w="100%">
        {loading ? "-" : bio}
      </Text>
    </VStack>
  );
};

const UserPosts = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Responsive post layout
  const postGap = useBreakpointValue({ base: "20px", md: "30px" });
  const justifyPosts = useBreakpointValue({ base: "center", md: "start" });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await get_users_posts(username);
        setPosts(posts);
      } catch {
        alert("error getting users posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [username]);

  return (
    <Flex 
      w="100%" 
      wrap="wrap" 
      gap={postGap} 
      pb="50px" 
      justify={justifyPosts}
    >
      {loading ? (
        <Text>Loading...</Text>
      ) : (
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
      )}
    </Flex>
  );
};

export default UserProfile;