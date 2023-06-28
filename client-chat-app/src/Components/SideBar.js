import React, { useContext, useState } from 'react'
import axios from 'axios'
import { Box, Button, Tooltip, Text } from '@chakra-ui/react'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
   
} from '@chakra-ui/react'

import {
    Input,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Stack
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'
import { userContext } from '../Context/UserProvider';
import { TbBrandHipchat, TbChevronDown } from "react-icons/tb";
import { useNavigate } from 'react-router-dom'

import DetailModal from "./DetailModal"
function SideBar({fetchAgain,setFetchAgain}) {
    const { userData } = useContext(userContext)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()
    const toast = useToast()
    const [searchUser, setSearchUser] = useState()
    const [userList, setUserList] = useState([]);
    const signOutHandler = () => {
        if (!userData) {
            navigate('/')
        } else {
            localStorage.clear();
            navigate('/')
        }
    }

    const accessChat=async(id)=>{
        const chat=await axios.post('/startChat',{
            userId:userData._id,
            receiverId:id
        });
         setFetchAgain(!fetchAgain)
         onClose()
        console.log(chat.data);
    }

    const searchApi = async () => {
        const { data } = await axios.get(`/searchUsers?search=${searchUser}&user=${userData}`);
        console.log(data);
        if (data.length===0) {
            toast({
                title: 'Not found',
                description: "No such user found.",
                status: 'warning',
                duration: 5000,
                position:'bottom-left',
                isClosable: true,
            })
        } else {
            setUserList(data)
        }
    }
    return (
        <>
            <Box

                bg={'white'}
                p={3}
                alignItems='center'
                display='flex'
                justifyContent='space-between'
            >
                <Tooltip hasArrow label='Search people' bg='blue.100' color='white'>
                    <Button onClick={onOpen}>
                        Search
                    </Button>
                </Tooltip>
                <Text  >
                    <TbBrandHipchat />
                    Chat
                </Text>
                <Menu>
                    <MenuButton as={Button} rightIcon={<TbChevronDown />}>
                        <Avatar name={userData.name} src={userData.profImage} />
                    </MenuButton>
                    <MenuList>
                        <MenuItem><DetailModal user={userData} /></MenuItem>
                        <MenuItem onClick={signOutHandler} >Sign Out</MenuItem>

                    </MenuList>
                </Menu>

                <Drawer
                    isOpen={isOpen}
                    placement='left'
                    onClose={onClose}

                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Find friends</DrawerHeader>

                        <DrawerBody display='flex'
                            justifyContent='space-between'
                        >
                            <Stack>

                              <Box
                               display='flex'
                              >
                                <Input onChange={(e) => setSearchUser(e.target.value)} placeholder='Type here...' />
                                <Button onClick={searchApi} >Search</Button>
                              </Box>

                                <Box
                                    display='flex'
                                    flexDirection='column'
                                    // padding='2px'
                                    
                                >

                                    {userList.map((user) => {
                                        return (
                                            <Box 
                                              key={user._id} 
                                              display='flex'
                                              alignItems='center'
                                              bg='gray.300'
                                              m='2'
                                              padding={2}
                                              borderRadius={10}
                                              onClick={()=>accessChat(user._id)}
                                            >
                                                <Avatar name={user.name} src={user.profImage} />
                                                <Text
                                                 px={4}
                                                >{user.name}</Text>
                                            </Box>

                                        )
                                    })}
                                </Box>
                            </Stack>
                        </DrawerBody>



                    </DrawerContent>
                </Drawer>
            </Box>
        </>
    )
}

export default SideBar