// import {
//   VStack,
//   Flex,
//   FormControl,
//   Input,
//   Button,
//   FormLabel,
//   Heading,
//   Text,
//   useToast,
//   Box,
// } from "@chakra-ui/react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/useAuth";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { auth_login } = useAuth();
//   const toast = useToast();

//   const handleLogin = async () => {
//     if (!username.trim() || !password.trim()) {
//       toast({
//         title: "Error",
//         description: "Please fill in all fields",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       await auth_login(username, password);
//     } catch (error) {
//       toast({
//         title: "Login failed",
//         description: error.message || "Invalid credentials",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     handleLogin();
//   };

//   const handleNav = () => {
//     navigate("/register");
//   };

//   return (
//     <Flex
//       w="100%"
//       minH="100vh"
//       justifyContent="center"
//       alignItems="center"
//       bg="gray.50"
//       py={8}
//     >
//       <Box
//         w="95%"
//         maxW="400px"
//         bg="white"
//         p={8}
//         borderRadius="xl"
//         boxShadow="xl"
//         border="1px solid"
//         borderColor="gray.200"
//       >
//         <VStack
//           as="form"
//           onSubmit={handleSubmit}
//           alignItems="start"
//           spacing={6}
//         >
//           {/* Header */}
//           <VStack alignItems="center" w="100%" spacing={2}>
//             <Heading size="lg" color="blue.600" fontWeight="bold">
//               Welcome Back
//             </Heading>
//             <Text color="gray.600" fontSize="sm" textAlign="center">
//               Sign in to your account to continue
//             </Text>
//           </VStack>

//           {/* Form Fields */}
//           <VStack w="100%" spacing={5}>
//             <FormControl isRequired>
//               <FormLabel 
//                 htmlFor="username" 
//                 fontSize="sm" 
//                 fontWeight="medium" 
//                 color="gray.700"
//                 mb={2}
//               >
//                 Username
//               </FormLabel>
//               <Input
//                 id="username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 bg="white"
//                 type="text"
//                 placeholder="Enter your username"
//                 size="md"
//                 height="45px"
//                 border="1px solid"
//                 borderColor="gray.300"
//                 borderRadius="lg"
//                 _focus={{
//                   borderColor: "blue.500",
//                   boxShadow: "0 0 0 1px blue.500",
//                 }}
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel 
//                 htmlFor="password" 
//                 fontSize="sm" 
//                 fontWeight="medium" 
//                 color="gray.700"
//                 mb={2}
//               >
//                 Password
//               </FormLabel>
//               <Input
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 bg="white"
//                 type="password"
//                 placeholder="Enter your password"
//                 size="md"
//                 height="45px"
//                 border="1px solid"
//                 borderColor="gray.300"
//                 borderRadius="lg"
//                 _focus={{
//                   borderColor: "blue.500",
//                   boxShadow: "0 0 0 1px blue.500",
//                 }}
//               />
//             </FormControl>
//           </VStack>

//           {/* Submit Button & Sign Up Link */}
//           <VStack w="100%" spacing={4} pt={2}>
//             <Button
//               type="submit"
//               w="100%"
//               colorScheme="blue"
//               size="md"
//               height="45px"
//               fontSize="15px"
//               fontWeight="semibold"
//               isLoading={loading}
//               loadingText="Signing in..."
//               borderRadius="lg"
//               _hover={{
//                 transform: "translateY(-1px)",
//                 boxShadow: "lg"
//               }}
//               transition="all 0.2s"
//             >
//               Sign In
//             </Button>
            
//             <Flex justify="center" w="100%">
//               <Text
//                 fontSize="sm"
//                 color="gray.600"
//               >
//                 Don't have an account?{" "}
//                 <Text
//                   as="span"
//                   color="blue.600"
//                   fontWeight="semibold"
//                   cursor="pointer"
//                   _hover={{ textDecoration: "underline" }}
//                   onClick={handleNav}
//                 >
//                   Sign up
//                 </Text>
//               </Text>
//             </Flex>
//           </VStack>
//         </VStack>
//       </Box>
//     </Flex>
//   );
// };

// export default Login;


import {
  VStack,
  Flex,
  FormControl,
  Input,
  Button,
  FormLabel,
  Heading,
  Text,
  useToast,
  Box,
  HStack,
  Divider,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { FaFacebook, FaGoogle, FaTwitter, FaApple, FaPhone, FaEnvelope } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { auth_login } = useAuth();
  const toast = useToast();

  const bgGradient = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #4c669f 0%, #3b5998 100%)"
  );

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await auth_login(username, password);
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const handleNav = () => {
    navigate("/register");
  };

  const socialLogins = [
    { icon: FaPhone, label: "Phone", color: "green" },
    { icon: FaEnvelope, label: "Email", color: "blue" },
    { icon: FaFacebook, label: "Facebook", color: "facebook" },
    { icon: FaGoogle, label: "Google", color: "red" },
    { icon: FaTwitter, label: "Twitter", color: "twitter" },
    { icon: FaApple, label: "Apple", color: "gray" },
  ];

  const features = [
    "Connect with friends and family",
    "Share photos and videos instantly",
    "Discover new communities",
    "Stay updated with latest trends",
    "Private and secure messaging",
    "Customize your profile"
  ];

  return (
    <Flex w="100%" minH="100vh" bg="gray.50">
      {/* Left Side - Brand & Features */}
      <Box
        flex={1}
        bg={bgGradient}
        display={{ base: "none", lg: "flex" }}
        alignItems="center"
        justifyContent="center"
        p={8}
        position="relative"
        overflow="hidden"
      >
        {/* Animated Background Elements */}
        <Box
          position="absolute"
          top="-10%"
          right="-10%"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="white"
          opacity={0.1}
        />
        <Box
          position="absolute"
          bottom="-10%"
          left="-10%"
          w="400px"
          h="400px"
          borderRadius="full"
          bg="white"
          opacity={0.05}
        />

        <VStack spacing={8} color="white" textAlign="center" zIndex={1}>
          {/* Animated Logo */}
          <Box
            w="100px"
            h="100px"
            bg="white"
            borderRadius="2xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 20px 40px rgba(0,0,0,0.1)"
            animation="float 3s ease-in-out infinite"
          >
            <Text
              fontSize="2xl"
              fontWeight="bold"
              bgGradient="linear(to-r, #667eea, #764ba2)"
              bgClip="text"
            >
              PB
            </Text>
          </Box>

          <VStack spacing={4}>
            <Heading size="2xl" fontWeight="bold">
              Welcome to Phibook
            </Heading>
            <Text fontSize="xl" opacity={0.9}>
              Connect, Share, and Discover with the World
            </Text>
          </VStack>

          {/* Features List */}
          <VStack spacing={3} align="start" maxW="400px">
            {features.map((feature, index) => (
              <Flex key={index} align="center" opacity={0.9}>
                <Box
                  w="6px"
                  h="6px"
                  bg="white"
                  borderRadius="full"
                  mr={3}
                  opacity={0.7}
                />
                <Text fontSize="md">{feature}</Text>
              </Flex>
            ))}
          </VStack>

          {/* Stats */}
          <HStack spacing={6} pt={4}>
            <VStack>
              <Text fontSize="2xl" fontWeight="bold">10M+</Text>
              <Text fontSize="sm" opacity={0.8}>Users</Text>
            </VStack>
            <VStack>
              <Text fontSize="2xl" fontWeight="bold">50M+</Text>
              <Text fontSize="sm" opacity={0.8}>Posts</Text>
            </VStack>
            <VStack>
              <Text fontSize="2xl" fontWeight="bold">100+</Text>
              <Text fontSize="sm" opacity={0.8}>Countries</Text>
            </VStack>
          </HStack>
        </VStack>
      </Box>

      {/* Right Side - Login Form */}
      <Flex
        flex={1}
        alignItems="center"
        justifyContent="center"
        p={8}
        bg="white"
      >
        <Box
          w="100%"
          maxW="480px"
          bg="white"
          p={8}
          borderRadius="2xl"
          boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          border="1px solid"
          borderColor="gray.200"
          transform="translateY(0)"
          transition="all 0.3s ease"
          _hover={{
            transform: "translateY(-4px)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}
        >
          <VStack spacing={6}>
            {/* Mobile Brand Header */}
            <VStack spacing={3} display={{ lg: "none" }}>
              <Box
                w="70px"
                h="70px"
                bgGradient="linear(to-br, blue.400, purple.500)"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="white" fontSize="xl" fontWeight="bold">PB</Text>
              </Box>
              <Heading size="lg" color="gray.800">Phibook</Heading>
            </VStack>

            {/* Header */}
            <VStack spacing={2}>
              <Heading size="lg" color="gray.800">
                Welcome Back
              </Heading>
              <Text color="gray.600" textAlign="center">
                Sign in to your Phibook account to continue your journey
              </Text>
            </VStack>

            {/* Social Login Buttons */}
            <VStack w="100%" spacing={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                Quick access with
              </Text>
              
              <HStack w="100%" spacing={3}>
                {socialLogins.slice(0, 3).map((social, index) => (
                  <Button
                    key={index}
                    flex={1}
                    variant="outline"
                    leftIcon={<Icon as={social.icon} />}
                    height="45px"
                    borderRadius="lg"
                    colorScheme={social.color}
                  >
                    {social.label}
                  </Button>
                ))}
              </HStack>
              
              <HStack w="100%" spacing={3}>
                {socialLogins.slice(3).map((social, index) => (
                  <Button
                    key={index}
                    flex={1}
                    variant="outline"
                    leftIcon={<Icon as={social.icon} />}
                    height="45px"
                    borderRadius="lg"
                    colorScheme={social.color}
                  >
                    {social.label}
                  </Button>
                ))}
              </HStack>
            </VStack>

            {/* Divider */}
            <Flex align="center" w="100%">
              <Divider />
              <Text px={3} color="gray.500" fontSize="sm" whiteSpace="nowrap">
                Or continue with
              </Text>
              <Divider />
            </Flex>

            {/* Login Form */}
            <VStack
              as="form"
              onSubmit={handleSubmit}
              w="100%"
              spacing={5}
            >
              <FormControl isRequired>
                <FormLabel 
                  htmlFor="username" 
                  fontSize="sm" 
                  fontWeight="medium" 
                  color="gray.700"
                  mb={2}
                >
                  Username or Email
                </FormLabel>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  bg="white"
                  type="text"
                  placeholder="Enter your username or email"
                  size="md"
                  height="50px"
                  border="2px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.15)",
                  }}
                  transition="all 0.2s"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel 
                  htmlFor="password" 
                  fontSize="sm" 
                  fontWeight="medium" 
                  color="gray.700"
                  mb={2}
                >
                  Password
                </FormLabel>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="white"
                  type="password"
                  placeholder="Enter your password"
                  size="md"
                  height="50px"
                  border="2px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.15)",
                  }}
                  transition="all 0.2s"
                />
              </FormControl>

              {/* Forgot Password */}
              <Flex justify="end" w="100%">
                <Text
                  fontSize="sm"
                  color="blue.600"
                  fontWeight="medium"
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                >
                  Forgot password?
                </Text>
              </Flex>

              {/* Submit Button */}
              <Button
                type="submit"
                w="100%"
                bgGradient="linear(to-r, blue.500, purple.500)"
                color="white"
                size="lg"
                height="50px"
                fontSize="16px"
                fontWeight="semibold"
                isLoading={loading}
                loadingText="Signing in..."
                borderRadius="lg"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                }}
                transition="all 0.2s"
              >
                Sign In to Phibook
              </Button>
            </VStack>

            {/* Sign Up Link */}
            <Flex justify="center" w="100%" pt={4}>
              <Text fontSize="sm" color="gray.600">
                Don't have an account?{" "}
                <Text
                  as="span"
                  color="blue.600"
                  fontWeight="semibold"
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={handleNav}
                >
                  Create one now
                </Text>
              </Text>
            </Flex>

            {/* Security Note */}
            <Text fontSize="xs" color="gray.500" textAlign="center" pt={2}>
              🔒 Your data is securely encrypted and protected
            </Text>
          </VStack>
        </Box>
      </Flex>

      {/* Global Styles for Animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </Flex>
  );
};

export default Login;