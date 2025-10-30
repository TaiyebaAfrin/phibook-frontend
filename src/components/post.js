import { VStack, Text, HStack, Flex, Box, useToast } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { toggleLike } from "../api/endpoints";
import { useState } from "react";

const Post = ({
  id,
  username,
  description,
  formatted_date,
  liked,
  like_count,
}) => {
  const [clientLiked, setClientLiked] = useState(liked);
  const [clientLikeCount, setClientLikeCount] = useState(like_count);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleToggleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Optimistic update
    const previousLiked = clientLiked;
    const previousLikeCount = clientLikeCount;
    
    setClientLiked(!clientLiked);
    setClientLikeCount(clientLiked ? clientLikeCount - 1 : clientLikeCount + 1);

    try {
      const data = await toggleLike(id);
      if (!data.now_liked === clientLiked) {
        // Revert if response doesn't match
        setClientLiked(previousLiked);
        setClientLikeCount(previousLikeCount);
      }
    } catch (error) {
      // Revert on error
      setClientLiked(previousLiked);
      setClientLikeCount(previousLikeCount);
      
      toast({
        title: "Error",
        description: error.message || "Failed to like post",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack
      w="400px"
      minH="400px"
      border="1px solid"
      borderColor="gray.400"
      borderRadius="8px"
      bg="white"
      boxShadow="sm"
    >
      <HStack
        w="100%"
        flex="1"
        borderBottom="1px solid"
        borderColor="gray.300"
        p="0 20px"
        bg="gray.50"
        borderRadius="8px 8px 0 0"
        minH="60px"
      >
        <Text 
          fontWeight="medium" 
          cursor="pointer"
          onClick={() => window.location.href = `/${username}`}
          _hover={{ textDecoration: 'underline', color: 'blue.600' }}
        >
          @{username}
        </Text>
      </HStack>
      
      <Flex
        flex="6"
        w="100%"
        minH="200px"
        justifyContent="center"
        alignItems="center"
        p={4}
      >
        <Text textAlign="center" fontSize="lg" lineHeight="1.6">
          {description}
        </Text>
      </Flex>
      
      <Flex
        flex="2"
        w="100%"
        justifyContent="center"
        alignItems="center"
        borderTop="1px solid"
        bg="gray.50"
        borderColor="gray.400"
        borderRadius="0 0 8px 8px"
        minH="80px"
      >
        <HStack w="90%" justifyContent="space-between">
          <HStack spacing={3}>
            <Box 
              cursor={isLoading ? "not-allowed" : "pointer"} 
              opacity={isLoading ? 0.6 : 1}
            >
              {clientLiked ? (
                <Box color="red.500" fontSize="20px">
                  <FaHeart onClick={handleToggleLike} />
                </Box>
              ) : (
                <Box fontSize="20px" color="gray.600">
                  <FaRegHeart onClick={handleToggleLike} />
                </Box>
              )}
            </Box>
            <Text fontWeight="medium" fontSize="lg">
              {clientLikeCount}
            </Text>
          </HStack>
          <Text color="gray.600" fontSize="sm" fontWeight="medium">
            {formatted_date}
          </Text>
        </HStack>
      </Flex>
    </VStack>
  );
};

export default Post;