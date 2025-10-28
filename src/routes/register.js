import {
  VStack,
  Flex,
  FormControl,
  Input,
  Button,
  FormLabel,
  Heading,
  Text,
  HStack,
  Box,
  useToast,
} from "@chakra-ui/react";
import { register } from "../api/endpoints";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = async () => {
    if (!username || !email || !firstName || !lastName || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Password and confirm password do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await register(username, email, firstName, lastName, password);
      toast({
        title: "Success",
        description: "Registration successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Error registering account",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNav = () => {
    navigate("/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister();
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
        maxW="450px"
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
              Create Account
            </Heading>
            <Text color="gray.600" fontSize="sm" textAlign="center">
              Join our community and start sharing today
            </Text>
          </VStack>

          {/* Username & Email */}
          <VStack w="100%" spacing={4}>
            <FormControl isRequired>
              <FormLabel htmlFor="username" fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Username
              </FormLabel>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="white"
                type="text"
                placeholder="Enter username"
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
              <FormLabel htmlFor="email" fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Email
              </FormLabel>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="white"
                type="email"
                placeholder="Enter your email"
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

          {/* First Name & Last Name */}
          <HStack w="100%" spacing={3}>
            <FormControl isRequired>
              <FormLabel htmlFor="firstName" fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                First Name
              </FormLabel>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                bg="white"
                type="text"
                placeholder="First name"
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
              <FormLabel htmlFor="lastName" fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Last Name
              </FormLabel>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                bg="white"
                type="text"
                placeholder="Last name"
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
          </HStack>

          {/* Password & Confirm Password */}
          <HStack w="100%" spacing={3}>
            <FormControl isRequired>
              <FormLabel htmlFor="password" fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Password
              </FormLabel>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="white"
                type="password"
                placeholder="Password"
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
              <FormLabel htmlFor="confirmPassword" fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Confirm
              </FormLabel>
              <Input
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                bg="white"
                type="password"
                placeholder="Confirm password"
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
          </HStack>

          {/* Submit Button & Login Link */}
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
              loadingText="Creating account..."
              borderRadius="lg"
              _hover={{
                transform: "translateY(-1px)",
                boxShadow: "lg"
              }}
              transition="all 0.2s"
            >
              Create Account
            </Button>
            
            <Flex justify="center" w="100%">
              <Text
                fontSize="sm"
                color="gray.600"
              >
                Already have an account?{" "}
                <Text
                  as="span"
                  color="blue.600"
                  fontWeight="semibold"
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={handleNav}
                >
                  Log in
                </Text>
              </Text>
            </Flex>
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Register;