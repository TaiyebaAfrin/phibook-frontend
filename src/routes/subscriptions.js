import { Button, VStack, Text, Box, HStack } from "@chakra-ui/react";

const Subscriptions = () => {
  const plans = [
    {
      name: "Basic",
      price: "$9.99/month",
      description: "Perfect for getting started",
      features: ["10 Posts per month", "Basic analytics", "Email support"],
      paymentUrl: "https://stripe.com/docs/testing#cards", // Test URL
    },
    {
      name: "Pro",
      price: "$19.99/month",
      description: "Great for professionals",
      features: ["Unlimited posts", "Advanced analytics", "Priority support"],
      paymentUrl:
        "https://www.paypal.com/smarthelp/article/what-are-test-credit-card-numbers-ts2156", // Test URL
    },
    {
      name: "Enterprise",
      price: "$49.99/month",
      description: "For large organizations",
      features: ["Everything in Pro", "API access", "Dedicated support"],
      paymentUrl:
        "https://razorpay.com/docs/payments/payment-gateway/test-card-details/", // Test URL
    },
  ];

  const handlePaymentRedirect = (paymentUrl, planName) => {
    // Save user intent
    localStorage.setItem("pending_subscription", planName);

    // Redirect to external payment page
    window.location.href = paymentUrl;
  };

  return (
    <VStack spacing={8} p={6} w="100%" maxW="1200px" mx="auto">
      <VStack spacing={3}>
        <Text fontSize="3xl" fontWeight="bold" textAlign="center">
          Choose Your Plan
        </Text>
        <Text fontSize="lg" color="gray.600" textAlign="center">
          Select the perfect plan for your needs
        </Text>
      </VStack>

      <HStack spacing={6} align="stretch" flexWrap="wrap" justify="center">
        {plans.map((plan, index) => (
          <Box
            key={index}
            borderWidth="2px"
            borderColor="gray.200"
            borderRadius="xl"
            p={8}
            width="350px"
            textAlign="center"
            boxShadow="lg"
            _hover={{
              boxShadow: "2xl",
              transform: "translateY(-5px)",
              borderColor: "blue.500",
            }}
            transition="all 0.3s ease"
            bg="white"
          >
            <Text fontSize="2xl" fontWeight="bold" color="blue.600" mb={2}>
              {plan.name}
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="gray.800" my={3}>
              {plan.price}
            </Text>
            <Text color="gray.600" mb={6} fontSize="md">
              {plan.description}
            </Text>

            <VStack spacing={3} mb={6} alignItems="start">
              {plan.features.map((feature, featureIndex) => (
                <Text key={featureIndex} fontSize="sm" color="gray.700">
                  ✓ {feature}
                </Text>
              ))}
            </VStack>

            <Button
              colorScheme="blue"
              width="100%"
              size="lg"
              onClick={() => handlePaymentRedirect(plan.paymentUrl, plan.name)}
              _hover={{ transform: "scale(1.05)" }}
              transition="all 0.2s"
            >
              Get Started
            </Button>
          </Box>
        ))}
      </HStack>

      {/* Additional Info */}
      <Box
        mt={8}
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        bg="blue.50"
        borderColor="blue.200"
      >
        <Text
          fontSize="lg"
          fontWeight="bold"
          color="blue.800"
          textAlign="center"
        >
          💳 All plans come with a 14-day money-back guarantee
        </Text>
      </Box>
    </VStack>
  );
};

export default Subscriptions;
