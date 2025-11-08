// import { Text, Flex, HStack } from "@chakra-ui/react";
// import { useNavigate } from "react-router-dom";

// import { IoPersonOutline } from "react-icons/io5";
// import { IoMdAddCircleOutline } from "react-icons/io";
// import { FaHouse } from "react-icons/fa6";
// import { IoSearch } from "react-icons/io5";
// import { IoMdSettings } from "react-icons/io";
// import { MdOutlineSubscriptions } from "react-icons/md";

// const Navbar = () => {
//   const nav = useNavigate();

//   const handleNavigate = (route) => {
//     nav(`/${route}`);
//   };

//   const handleNavigateUser = () => {
//     const username = JSON.parse(localStorage.getItem("userData"))["username"];
//     nav(`/${username}`);
//     window.location.reload();
//   };

//   return (
//     <Flex
//       w="100vw"
//       h="90px"
//       bg="blue.600"
//       justifyContent="center"
//       alignItems="center"
//     >
//       <HStack w="90%" justifyContent="space-between" color="white">
//         <Text fontSize="24px" fontWeight="bold">
//           PhiBook
//         </Text>
//         <HStack gap="20px">
//           <Text onClick={handleNavigateUser}>
//             <IoPersonOutline size="20px" />
//           </Text>
//           <Text onClick={(route) => handleNavigate("create/post")}>
//             <IoMdAddCircleOutline size="22px" />
//           </Text>
//           <Text onClick={(route) => handleNavigate("")}>
//             <FaHouse size="20px" />
//           </Text>
//           <Text onClick={(route) => handleNavigate("search")}>
//             <IoSearch size="20px" />
//           </Text>
//           <Text onClick={(route) => handleNavigate("settings")}>
//             <IoMdSettings size="20px" />
//           </Text>
//           <Text onClick={() => handleNavigate("subscriptions")}>
//             <MdOutlineSubscriptions size="20px" />
//           </Text>
//         </HStack>
//       </HStack>
//     </Flex>
//   );
// };

// export default Navbar;


import { Text, Flex, HStack, Icon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { IoPersonOutline } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaHouse } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineSubscriptions } from "react-icons/md";

const Navbar = () => {
  const nav = useNavigate();

  const handleNavigate = (route) => {
    nav(`/${route}`);
  };

  const handleNavigateUser = () => {
    const username = JSON.parse(localStorage.getItem("userData"))["username"];
    nav(`/${username}`);
    window.location.reload();
  };

  return (
    <Flex
      w="100vw"
      h="90px"
      bgGradient="linear(to-r, blue.500, purple.500)"
      justifyContent="center"
      alignItems="center"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    >
      <HStack w="90%" justifyContent="space-between" color="white">
        <Text fontSize="24px" fontWeight="bold" color="white">
          PhiBook
        </Text>
        <HStack gap="20px">
          <Icon 
            as={IoPersonOutline} 
            size="20px" 
            cursor="pointer"
            _hover={{ color: "blue.100", transform: "scale(1.1)" }}
            transition="all 0.2s"
            onClick={handleNavigateUser}
          />
          <Icon 
            as={IoMdAddCircleOutline} 
            size="22px" 
            cursor="pointer"
            _hover={{ color: "blue.100", transform: "scale(1.1)" }}
            transition="all 0.2s"
            onClick={() => handleNavigate("create/post")}
          />
          <Icon 
            as={FaHouse} 
            size="20px" 
            cursor="pointer"
            _hover={{ color: "blue.100", transform: "scale(1.1)" }}
            transition="all 0.2s"
            onClick={() => handleNavigate("")}
          />
          <Icon 
            as={IoSearch} 
            size="20px" 
            cursor="pointer"
            _hover={{ color: "blue.100", transform: "scale(1.1)" }}
            transition="all 0.2s"
            onClick={() => handleNavigate("search")}
          />
          <Icon 
            as={IoMdSettings} 
            size="20px" 
            cursor="pointer"
            _hover={{ color: "blue.100", transform: "scale(1.1)" }}
            transition="all 0.2s"
            onClick={() => handleNavigate("settings")}
          />
          <Icon 
            as={MdOutlineSubscriptions} 
            size="20px" 
            cursor="pointer"
            _hover={{ color: "blue.100", transform: "scale(1.1)" }}
            transition="all 0.2s"
            onClick={() => handleNavigate("subscriptions")}
          />
        </HStack>
      </HStack>
    </Flex>
  );
};

export default Navbar;