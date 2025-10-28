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
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

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
      minH="100vh"
      justifyContent="center"
      alignItems="center"
      bg="gray.50"
      py={8}
    >
      <Box
        w="95%"
        maxW="400px"
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="xl"
        border="1px solid"
        borderColor="gray.200"
      >
        <VStack
          as="form"
          onSubmit={handleSubmit}
          alignItems="start"
          spacing={6}
        >
          {/* Header */}
          <VStack alignItems="center" w="100%" spacing={2}>
            <Heading size="lg" color="blue.600" fontWeight="bold">
              Welcome Back
            </Heading>
            <Text color="gray.600" fontSize="sm" textAlign="center">
              Sign in to your account to continue
            </Text>
          </VStack>

          {/* Form Fields */}
          <VStack w="100%" spacing={5}>
            <FormControl isRequired>
              <FormLabel 
                htmlFor="username" 
                fontSize="sm" 
                fontWeight="medium" 
                color="gray.700"
                mb={2}
              >
                Username
              </FormLabel>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="white"
                type="text"
                placeholder="Enter your username"
                size="md"
                height="45px"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="lg"
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
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
                height="45px"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="lg"
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
              />
            </FormControl>
          </VStack>

          {/* Submit Button & Sign Up Link */}
          <VStack w="100%" spacing={4} pt={2}>
            <Button
              type="submit"
              w="100%"
              colorScheme="blue"
              size="md"
              height="45px"
              fontSize="15px"
              fontWeight="semibold"
              isLoading={loading}
              loadingText="Signing in..."
              borderRadius="lg"
              _hover={{
                transform: "translateY(-1px)",
                boxShadow: "lg"
              }}
              transition="all 0.2s"
            >
              Sign In
            </Button>
            
            <Flex justify="center" w="100%">
              <Text
                fontSize="sm"
                color="gray.600"
              >
                Don't have an account?{" "}
                <Text
                  as="span"
                  color="blue.600"
                  fontWeight="semibold"
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={handleNav}
                >
                  Sign up
                </Text>
              </Text>
            </Flex>
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;