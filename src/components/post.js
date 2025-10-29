import { 
  VStack, Text, HStack, Flex, Box, Input, Button, Avatar, 
  useToast, Image, Link, Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalBody, ModalCloseButton, useDisclosure 
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart, FaComment, FaRegComment, FaLink } from "react-icons/fa";
import { toggleLike, create_comment, get_post_comments } from "../api/endpoints";
import { useState } from "react";

const Post = ({
  id,
  username,
  user_profile_image,
  description,
  formatted_date,
  liked,
  like_count,
  comment_count: initialCommentCount,
  post_type,
  image,
  video_url,
  youtube_id,
  link_url,
  link_image,
  link_title
}) => {
  const [clientLiked, setClientLiked] = useState(liked);
  const [clientLikeCount, setClientLikeCount] = useState(like_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [clientCommentCount, setClientCommentCount] = useState(initialCommentCount);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleToggleLike = async () => {
    try {
      const data = await toggleLike(id);
      if (data.now_liked) {
        setClientLiked(true);
        setClientLikeCount(clientLikeCount + 1);
      } else {
        setClientLiked(false);
        setClientLikeCount(clientLikeCount - 1);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoading(true);
      try {
        const commentsData = await get_post_comments(id);
        setComments(commentsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load comments",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (commentText.trim() === '') return;
    
    setLoading(true);
    try {
      const newComment = await create_comment(id, commentText);
      if (newComment.id) {
        setComments([newComment, ...comments]);
        setCommentText('');
        setClientCommentCount(clientCommentCount + 1);
        toast({
          title: "Success",
          description: "Comment added",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderMediaContent = () => {
    switch (post_type) {
      case 'image':
        return (
          <Box 
            w="100%" 
            maxH="400px" 
            overflow="hidden" 
            borderRadius="8px" 
            cursor="pointer"
            onClick={onOpen}
          >
            <Image 
              src={image} 
              alt="Post image" 
              w="100%" 
              h="100%" 
              objectFit="cover" 
            />
          </Box>
        );
      
      case 'video':
        return (
          <Box w="100%" borderRadius="8px" overflow="hidden">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${youtube_id}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Box>
        );
      
      case 'link':
        return (
          <Link href={link_url} isExternal>
            <Box 
              border="1px solid" 
              borderColor="gray.200" 
              borderRadius="8px" 
              overflow="hidden"
              _hover={{ shadow: "md" }}
            >
              {link_image && (
                <Image 
                  src={link_image} 
                  alt="Link preview" 
                  w="100%" 
                  h="200px" 
                  objectFit="cover" 
                />
              )}
              <Box p="15px">
                <HStack mb="10px">
                  <FaLink color="gray" />
                  <Text fontSize="sm" color="gray.600" fontWeight="bold">
                    {new URL(link_url).hostname}
                  </Text>
                </HStack>
                <Text fontWeight="bold" fontSize="lg" noOfLines={2}>
                  {link_title}
                </Text>
              </Box>
            </Box>
          </Link>
        );
      
      default:
        return null;
    }
  };

  return (
    <VStack
      w="100%"
      maxW="600px"
      border="1px solid"
      borderColor="gray.300"
      borderRadius="12px"
      spacing={0}
      bg="white"
      shadow="sm"
    >
      {/* Post Header */}
      <HStack w="100%" p="15px 20px" spacing="10px">
        <Avatar
          size="sm"
          src={user_profile_image}
          name={username}
        />
        <VStack align="start" spacing="0" flex="1">
          <Text fontWeight="bold" fontSize="14px">
            {username}
          </Text>
          <Text fontSize="12px" color="gray.500">
            {formatted_date}
          </Text>
        </VStack>
      </HStack>
      
      {/* Post Content */}
      <Box w="100%" p="0 20px 15px">
        {description && (
          <Text mb={post_type !== 'text' ? "15px" : "0"} whiteSpace="pre-wrap">
            {description}
          </Text>
        )}
        {renderMediaContent()}
      </Box>
      
      {/* Post Actions */}
      <Flex
        w="100%"
        p="10px 20px"
        justifyContent="space-between"
        borderTop="1px solid"
        borderColor="gray.200"
        bg="gray.50"
      >
        <HStack spacing="25px">
          <HStack cursor="pointer" onClick={handleToggleLike}>
            <Box>
              {clientLiked ? (
                <Box color="red.500">
                  <FaHeart />
                </Box>
              ) : (
                <FaRegHeart />
              )}
            </Box>
            <Text fontSize="14px">{clientLikeCount}</Text>
          </HStack>
          
          <HStack cursor="pointer" onClick={handleToggleComments}>
            <Box>
              {showComments ? <FaComment /> : <FaRegComment />}
            </Box>
            <Text fontSize="14px">{clientCommentCount}</Text>
          </HStack>
        </HStack>
      </Flex>

      {/* Comments Section */}
      {showComments && (
        <VStack w="100%" p="15px" spacing="15px" bg="white" borderTop="1px solid" borderColor="gray.200">
          {/* Add Comment Input */}
          <HStack w="100%">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              size="sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !loading) handleAddComment();
              }}
              isDisabled={loading}
            />
            <Button 
              size="sm" 
              onClick={handleAddComment} 
              colorScheme="blue"
              isLoading={loading}
              loadingText="Posting"
            >
              Post
            </Button>
          </HStack>
          
          {/* Comments List */}
          <VStack w="100%" spacing="10px" maxH="200px" overflowY="auto">
            {loading ? (
              <Text>Loading comments...</Text>
            ) : (
              <>
                {comments.map((comment) => (
                  <HStack key={comment.id} w="100%" align="start" spacing="10px">
                    <Avatar size="xs" src={comment.profile_image} name={comment.username} />
                    <VStack align="start" spacing="0" flex="1">
                      <HStack>
                        <Text fontWeight="bold" fontSize="sm">@{comment.username}</Text>
                        <Text fontSize="xs" color="gray.500">{comment.formatted_date}</Text>
                      </HStack>
                      <Text fontSize="sm">{comment.text}</Text>
                    </VStack>
                  </HStack>
                ))}
                {comments.length === 0 && (
                  <Text color="gray.500" fontSize="sm">No comments yet. Be the first to comment!</Text>
                )}
              </>
            )}
          </VStack>
        </VStack>
      )}

      {/* Image Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Post Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody p="0">
            <Image src={image} alt="Post image" w="100%" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default Post;
























// import { VStack, Text, HStack, Flex, Box, Input, Button, Avatar, useToast } from "@chakra-ui/react";
// import { FaHeart, FaRegHeart, FaComment, FaRegComment } from "react-icons/fa";
// import { toggleLike, create_comment, get_post_comments } from "../api/endpoints";
// import { useState } from "react";

// const Post = ({
//   id,
//   username,
//   description,
//   formatted_date,
//   liked,
//   like_count,
//   comment_count: initialCommentCount
// }) => {
//   const [clientLiked, setClientLiked] = useState(liked);
//   const [clientLikeCount, setClientLikeCount] = useState(like_count);
//   const [showComments, setShowComments] = useState(false);
//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState('');
//   const [clientCommentCount, setClientCommentCount] = useState(initialCommentCount);
//   const [loading, setLoading] = useState(false);
//   const toast = useToast();

//   const handleToggleLike = async () => {
//     try {
//       const data = await toggleLike(id);
//       if (data.now_liked) {
//         setClientLiked(true);
//         setClientLikeCount(clientLikeCount + 1);
//       } else {
//         setClientLiked(false);
//         setClientLikeCount(clientLikeCount - 1);
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to like post",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   const handleToggleComments = async () => {
//     if (!showComments && comments.length === 0) {
//       setLoading(true);
//       try {
//         const commentsData = await get_post_comments(id);
//         setComments(commentsData);
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to load comments",
//           status: "error",
//           duration: 3000,
//           isClosable: true,
//         });
//       } finally {
//         setLoading(false);
//       }
//     }
//     setShowComments(!showComments);
//   };

//   const handleAddComment = async () => {
//     if (commentText.trim() === '') return;
    
//     setLoading(true);
//     try {
//       const newComment = await create_comment(id, commentText);
//       if (newComment.id) {
//         setComments([newComment, ...comments]);
//         setCommentText('');
//         setClientCommentCount(clientCommentCount + 1);
//         toast({
//           title: "Success",
//           description: "Comment added",
//           status: "success",
//           duration: 2000,
//           isClosable: true,
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to add comment",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <VStack
//       w="400px"
//       minH="400px"
//       border="1px solid"
//       borderColor="gray.400"
//       borderRadius="8px"
//       spacing={0}
//     >
//       <HStack
//         w="100%"
//         p="10px 20px"
//         borderBottom="1px solid"
//         borderColor="gray.300"
//         bg="gray.50"
//         borderRadius="8px 8px 0 0"
//       >
//         <Text fontWeight="bold">@{username}</Text>
//       </HStack>
      
//       <Flex
//         flex="1"
//         w="100%"
//         minH="200px"
//         justifyContent="center"
//         alignItems="center"
//         p="20px"
//       >
//         <Text textAlign="center">{description}</Text>
//       </Flex>
      
//       <Flex
//         w="100%"
//         p="10px 20px"
//         justifyContent="space-between"
//         borderTop="1px solid"
//         bg="gray.50"
//         borderColor="gray.400"
//       >
//         <HStack spacing="20px">
//           <HStack>
//             <Box cursor="pointer" onClick={handleToggleLike}>
//               {clientLiked ? (
//                 <Box color="red">
//                   <FaHeart />
//                 </Box>
//               ) : (
//                 <FaRegHeart />
//               )}
//             </Box>
//             <Text>{clientLikeCount}</Text>
//           </HStack>
          
//           <HStack cursor="pointer" onClick={handleToggleComments}>
//             <Box>
//               {showComments ? <FaComment /> : <FaRegComment />}
//             </Box>
//             <Text>{clientCommentCount}</Text>
//           </HStack>
//         </HStack>
        
//         <Text color="gray.600">{formatted_date}</Text>
//       </Flex>

//       {/* Comments Section */}
//       {showComments && (
//         <VStack w="100%" p="15px" spacing="15px" bg="white" borderTop="1px solid" borderColor="gray.200">
//           {/* Add Comment Input */}
//           <HStack w="100%">
//             <Input
//               value={commentText}
//               onChange={(e) => setCommentText(e.target.value)}
//               placeholder="Add a comment..."
//               size="sm"
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter' && !loading) handleAddComment();
//               }}
//               isDisabled={loading}
//             />
//             <Button 
//               size="sm" 
//               onClick={handleAddComment} 
//               colorScheme="blue"
//               isLoading={loading}
//               loadingText="Posting"
//             >
//               Post
//             </Button>
//           </HStack>
          
//           {/* Comments List */}
//           <VStack w="100%" spacing="10px" maxH="200px" overflowY="auto">
//             {loading ? (
//               <Text>Loading comments...</Text>
//             ) : (
//               <>
//                 {comments.map((comment) => (
//                   <HStack key={comment.id} w="100%" align="start" spacing="10px">
//                     <Avatar size="xs" src={comment.profile_image} name={comment.username} />
//                     <VStack align="start" spacing="0" flex="1">
//                       <HStack>
//                         <Text fontWeight="bold" fontSize="sm">@{comment.username}</Text>
//                         <Text fontSize="xs" color="gray.500">{comment.formatted_date}</Text>
//                       </HStack>
//                       <Text fontSize="sm">{comment.text}</Text>
//                     </VStack>
//                   </HStack>
//                 ))}
//                 {comments.length === 0 && (
//                   <Text color="gray.500" fontSize="sm">No comments yet. Be the first to comment!</Text>
//                 )}
//               </>
//             )}
//           </VStack>
//         </VStack>
//       )}
//     </VStack>
//   );
// };

// export default Post;