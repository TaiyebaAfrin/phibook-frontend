
import { 
  VStack, 
  Text, 
  HStack, 
  Flex, 
  Box, 
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  IconButton
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart, FaComment, FaTrash } from "react-icons/fa";
import { toggleLike, create_comment, get_comments, delete_comment, delete_post } from "../api/endpoints";
import { useState } from "react";

const Post = ({
  id,
  username,
  description,
  formatted_date,
  liked,
  like_count,
  comment_count,
  can_delete
}) => {
  const [clientLiked, setClientLiked] = useState(liked);
  const [clientLikeCount, setClientLikeCount] = useState(like_count);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleToggleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const previousLiked = clientLiked;
    const previousLikeCount = clientLikeCount;
    
    setClientLiked(!clientLiked);
    setClientLikeCount(clientLiked ? clientLikeCount - 1 : clientLikeCount + 1);

    try {
      const data = await toggleLike(id);
      if (!data.now_liked === clientLiked) {
        setClientLiked(previousLiked);
        setClientLikeCount(previousLikeCount);
      }
    } catch (error) {
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

  const handleShowComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    setLoadingComments(true);
    try {
      const commentsData = await get_comments(id);
      setComments(commentsData);
      setShowComments(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load comments",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setPostingComment(true);
    try {
      const comment = await create_comment(id, newComment);
      setComments(prev => [comment, ...prev]);
      setNewComment("");
      toast({
        title: "Success",
        description: "Comment added successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await delete_comment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast({
        title: "Success",
        description: "Comment deleted successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeletePost = async () => {
    try {
      await delete_post(id);
      toast({
        title: "Success",
        description: "Post deleted successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      // Refresh the page or remove post from parent component
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  return (
    <>
      <VStack
        w="400px"
        minH="400px"
        border="1px solid"
        borderColor="gray.400"
        borderRadius="8px"
        bg="white"
        boxShadow="sm"
      >
        {/* Post Header */}
        <HStack
          w="100%"
          p="10px 20px"
          borderBottom="1px solid"
          borderColor="gray.300"
          bg="gray.50"
          borderRadius="8px 8px 0 0"
          justify="space-between"
        >
          <Text 
            fontWeight="medium" 
            cursor="pointer"
            onClick={() => window.location.href = `/${username}`}
            _hover={{ textDecoration: 'underline', color: 'blue.600' }}
          >
            @{username}
          </Text>
          {can_delete && (
            <IconButton
              icon={<FaTrash />}
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={onOpen}
              aria-label="Delete post"
            />
          )}
        </HStack>
        
        {/* Post Content */}
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
        
        {/* Post Actions */}
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
            <HStack spacing={4}>
              {/* Like Button */}
              <HStack spacing={2}>
                <Box 
                  cursor={isLoading ? "not-allowed" : "pointer"} 
                  opacity={isLoading ? 0.6 : 1}
                >
                  {clientLiked ? (
                    <Box color="red.500" fontSize="18px">
                      <FaHeart onClick={handleToggleLike} />
                    </Box>
                  ) : (
                    <Box fontSize="18px" color="gray.600">
                      <FaRegHeart onClick={handleToggleLike} />
                    </Box>
                  )}
                </Box>
                <Text fontWeight="medium" fontSize="md">
                  {clientLikeCount}
                </Text>
              </HStack>
              
              {/* Comment Button */}
              <HStack spacing={2}>
                <Box 
                  cursor="pointer" 
                  fontSize="18px" 
                  color="gray.600"
                  onClick={handleShowComments}
                >
                  <FaComment />
                </Box>
                <Text fontWeight="medium" fontSize="md">
                  {comment_count}
                </Text>
              </HStack>
            </HStack>
            
            <Text color="gray.600" fontSize="sm" fontWeight="medium">
              {formatted_date}
            </Text>
          </HStack>
        </Flex>

        {/* Comments Section */}
        {showComments && (
          <VStack w="100%" p={4} borderTop="1px solid" borderColor="gray.200" spacing={4}>
            {/* Add Comment */}
            <HStack w="100%" spacing={2}>
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                size="sm"
              />
              <Button
                size="sm"
                colorScheme="blue"
                onClick={handleAddComment}
                isLoading={postingComment}
                isDisabled={!newComment.trim()}
              >
                Post
              </Button>
            </HStack>

            {/* Comments List */}
            <VStack w="100%" spacing={3} maxH="200px" overflowY="auto">
              {loadingComments ? (
                <Text>Loading comments...</Text>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <HStack key={comment.id} w="100%" justify="space-between" align="start">
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack spacing={2}>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          cursor="pointer"
                          onClick={() => window.location.href = `/${comment.username}`}
                          _hover={{ textDecoration: 'underline' }}
                        >
                          @{comment.username}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {comment.formatted_date}
                        </Text>
                      </HStack>
                      <Text fontSize="sm">{comment.text}</Text>
                    </VStack>
                    {comment.can_delete && (
                      <IconButton
                        icon={<FaTrash />}
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteComment(comment.id)}
                        aria-label="Delete comment"
                      />
                    )}
                  </HStack>
                ))
              ) : (
                <Text color="gray.500" fontSize="sm">
                  No comments yet
                </Text>
              )}
            </VStack>
          </VStack>
        )}
      </VStack>

      {/* Delete Post Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Post</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to delete this post? This action cannot be undone.</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeletePost}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Post;