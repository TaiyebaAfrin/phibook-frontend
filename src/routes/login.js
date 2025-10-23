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
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false); // Add loading state
//   const navigate = useNavigate();
//   const { auth_login } = useAuth();
//   const toast = useToast(); // Add toast

//   const handleLogin = () => {
//     auth_login(username, password);
//   };

//   const handleNav = () => {
//     navigate("/register");
//   };

//   return (
//     <Flex
//       w="100%"
//       h="calc(100vh - 90px)"
//       justifyContent="center"
//       alignItems="center"
//     >
//       <VStack alignItems="start" w="95%" maxW="400px" gap="30px">
//         <Heading>Login</Heading>
//         <FormControl>
//           <FormLabel htmlFor="username">Username</FormLabel>
//           <Input
//             onChange={(e) => setUsername(e.target.value)}
//             bg="white"
//             type="text"
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel htmlFor="password">Password</FormLabel>
//           <Input
//             onChange={(e) => setPassword(e.target.value)}
//             bg="white"
//             type="password"
//           />
//         </FormControl>
//         <VStack w="100%" alignItems="start">
//           <Button
//             onClick={handleLogin}
//             w="100%"
//             colorScheme="green"
//             fontSize="18px"
//           >
//             Login
//           </Button>
//           <Text onClick={handleNav} fontSize="14px" color="gray.500">
//             Don't have an account? Sign up
//           </Text>
//         </VStack>
//       </VStack>
//     </Flex>
//   );
// };

// export default Login;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { auth_login } = useAuth();
  const toast = useToast();

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

  return (
    <Flex
      w="100%"
      h="calc(100vh - 90px)"
      justifyContent="center"
      alignItems="center"
    >
      <VStack
        as="form"
        onSubmit={handleSubmit}
        alignItems="start"
        w="95%"
        maxW="400px"
        gap="30px"
      >
        <Heading>Login</Heading>
        <FormControl isRequired>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            bg="white"
            type="text"
            placeholder="Enter your username"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            bg="white"
            type="password"
            placeholder="Enter your password"
          />
        </FormControl>
        <VStack w="100%" alignItems="start">
          <Button
            type="submit"
            w="100%"
            colorScheme="green"
            fontSize="18px"
            isLoading={loading}
            loadingText="Logging in..."
          >
            Login
          </Button>
          <Text
            onClick={handleNav}
            fontSize="14px"
            color="gray.500"
            cursor="pointer"
            _hover={{ color: "gray.700", textDecoration: "underline" }}
          >
            Don't have an account? Sign up
          </Text>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default Login;
