import { VStack, Text, HStack, Flex, Box, Image, Button, Textarea, Icon } from "@chakra-ui/react";
import { FaHeart, FaRegHeart, FaComment, FaFile, FaPaperclip } from "react-icons/fa";
import { useState } from "react";
import { toggleLike, create_comment, get_post_comments, toggle_comment_like, delete_comment } from "../api/endpoints";
import { SERVER_URL } from "../constants/constants";

const Post = ({
  id,
  username,
  description,
  formatted_date,
  liked,
  like_count,
  image_url,
  file_url,
  file_name,
  comment_count
}) => {
  const [clientLiked, setClientLiked] = useState(liked);
  const [clientLikeCount, setClientLikeCount] = useState(like_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [clientCommentCount, setClientCommentCount] = useState(comment_count || 0);

  const handleToggleLike = async () => {
    const data = await toggleLike(id);
    if (data.now_liked) {
      setClientLiked(true);
      setClientLikeCount(clientLikeCount + 1);
    } else {
      setClientLiked(false);
      setClientLikeCount(clientLikeCount - 1);
    }
  };

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const commentsData = await get_post_comments(id);
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const commentData = await create_comment(id, newComment);
      setComments(prevComments => [commentData, ...prevComments]);
      setNewComment("");
      setClientCommentCount(prev => prev + 1);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    try {
      const data = await toggle_comment_like(commentId);
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                user_has_liked: data.now_liked,
                like_count: data.now_liked ? comment.like_count + 1 : comment.like_count - 1
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error toggling comment like:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await delete_comment(commentId);
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      setClientCommentCount(prev => prev - 1);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDownloadFile = () => {
    if (file_url) {
      window.open(file_url, '_blank');
    }
  };

  // Function to get proper image URL (handles both local and Cloudinary)
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `${SERVER_URL}${url}`;
  };

  return (
    <VStack
      w="400px"
      minH="400px"
      border="1px solid"
      borderColor="gray.400"
      borderRadius="8px"
      bg="white"
      spacing={0}
    >
      {/* Header */}
      <HStack
        w="100%"
        p="12px 20px"
        borderBottom="1px solid"
        borderColor="gray.300"
        bg="gray.50"
        borderRadius="8px 8px 0 0"
        justifyContent="space-between"
      >
        <Text fontWeight="bold">@{username}</Text>
        <Text fontSize="sm" color="gray.600">{formatted_date}</Text>
      </HStack>

      {/* Image Section */}
      {image_url && (
        <Box w="100%" maxH="300px" overflow="hidden">
          <Image
            src={getImageUrl(image_url)}
            alt="Post image"
            w="100%"
            h="auto"
            maxH="300px"
            objectFit="cover"
          />
        </Box>
      )}

      {/* File Section */}
      {file_url && (
        <HStack
          w="100%"
          p="12px 20px"
          bg="blue.50"
          borderY="1px solid"
          borderColor="gray.200"
          justifyContent="space-between"
        >
          <HStack>
            <Icon as={FaPaperclip} color="blue.500" />
            <Text fontSize="sm" fontWeight="medium" isTruncated maxW="200px">
              {file_name || "Attached File"}
            </Text>
          </HStack>
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            leftIcon={<FaFile />}
            onClick={handleDownloadFile}
          >
            Download
          </Button>
        </HStack>
      )}

      {/* Description */}
      <Flex
        flex="1"
        w="100%"
        p="20px"
        minH="80px"
        justifyContent="center"
        alignItems="center"
      >
        <Text textAlign="center" whiteSpace="pre-wrap">{description}</Text>
      </Flex>

      {/* Actions Bar */}
      <Flex
        w="100%"
        p="12px 20px"
        borderTop="1px solid"
        borderColor="gray.300"
        bg="gray.50"
        borderRadius="0 0 8px 8px"
      >
        <HStack w="100%" justifyContent="space-between">
          {/* Like Section */}
          <HStack spacing={3}>
            <HStack cursor="pointer" onClick={handleToggleLike}>
              <Box color={clientLiked ? "red.500" : "gray.500"}>
                {clientLiked ? <FaHeart /> : <FaRegHeart />}
              </Box>
              <Text fontSize="sm">{clientLikeCount}</Text>
            </HStack>

            {/* Comment Section */}
            <HStack cursor="pointer" onClick={handleToggleComments}>
              <Box color="gray.500">
                <FaComment />
              </Box>
              <Text fontSize="sm">{clientCommentCount}</Text>
            </HStack>
          </HStack>
        </HStack>
      </Flex>

      {/* Comments Section */}
      {showComments && (
        <VStack w="100%" p="20px" spacing={4} bg="gray.50" borderTop="1px solid" borderColor="gray.300">
          {/* Add Comment */}
          <HStack w="100%" spacing={2}>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              size="sm"
              rows={2}
              bg="white"
            />
            <Button
              size="sm"
              colorScheme="blue"
              onClick={handleAddComment}
              isDisabled={!newComment.trim()}
            >
              Post
            </Button>
          </HStack>

          {/* Comments List */}
          <VStack w="100%" spacing={3} maxH="200px" overflowY="auto">
            {loadingComments ? (
              <Text>Loading comments...</Text>
            ) : comments.length === 0 ? (
              <Text color="gray.500" fontSize="sm">No comments yet</Text>
            ) : (
              comments.map((comment) => (
                <Box
                  key={comment.id}
                  w="100%"
                  p={3}
                  bg="white"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <HStack justifyContent="space-between" mb={2}>
                    <Text fontWeight="bold" fontSize="sm">@{comment.username}</Text>
                    <HStack spacing={2}>
                      <Text fontSize="xs" color="gray.500">{comment.formatted_date}</Text>
                      {/* Delete button - only show if user owns the comment */}
                      {comment.username === localStorage.getItem('currentUser') && (
                        <Button
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </HStack>
                  </HStack>
                  <Text fontSize="sm" mb={2}>{comment.text}</Text>
                  <HStack spacing={3}>
                    <HStack 
                      cursor="pointer" 
                      onClick={() => handleToggleCommentLike(comment.id)}
                      spacing={1}
                    >
                      <Box color={comment.user_has_liked ? "red.500" : "gray.500"} fontSize="sm">
                        {comment.user_has_liked ? <FaHeart /> : <FaRegHeart />}
                      </Box>
                      <Text fontSize="xs">{comment.like_count}</Text>
                    </HStack>
                  </HStack>
                </Box>
              ))
            )}
          </VStack>
        </VStack>
      )}
    </VStack>
  );
};

export default Post;
