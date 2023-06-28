import React, { useState, useContext, useEffect } from 'react'
import { Box, Button, Input } from '@chakra-ui/react'
import { userContext } from '../Context/UserProvider'
import { useToast, Avatar, Text, Stack } from '@chakra-ui/react'
import { RxCross2 } from 'react-icons/rx';
import AddGroupMember from './AddGroupMember'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'

import axios from 'axios'
function MyChats({ fetchAgain, setFetchAgain }) {

  const { userData, chatList, setChatList,selectedChat,setSelectedChat } = useContext(userContext)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [userList, setUserList] = useState([])
  const [groupMember, setGroupMembers] = useState([])
  const [groupName,setGroupName]=useState();
  // const [chatList,setChatList]=useState()

  console.log(groupMember);
  const toast = useToast();
  const searchApi = async (searchUser, userData) => {
    const { data } = await axios.get(`/searchUsers?search=${searchUser}&user=${userData}`);
    console.log(data);
    if (data.length === 0) {
      toast({
        title: 'Not found',
        description: "No such user found.",
        status: 'warning',
        duration: 5000,
        position: 'bottom-left',
        isClosable: true,
      })
    } else {
      setUserList(data)
    }
  }
  
  const createGroup=async ()=>{
            
              
           

            const res=await axios.post('/createGroupChat',{
              userId:userData._id,
              grpName:groupName,
              grpUsers:JSON.stringify(groupMember)
            })


            if(res.status===202)
            {
              toast({
                title: 'Fill requirements',
                description: res.data.message,
                status: 'warning',
                duration: 5000,
                position: 'bottom-left',
                isClosable: true,
              })
              return;
            }
             setFetchAgain(!fetchAgain)
            console.log("response is",res);
            onClose()

  }

  const removeMember=async (member)=>{
    let newMembers = groupMember.filter(function(e) { return e !== member })
    setGroupMembers(newMembers)
  }
  const fetchChats = async () => {
    try {
      const chats = await axios.post('/fetchChats', {
        userId: userData._id
      })
      console.log(chats.data);
      if (chats.data.length > 0) {
        setChatList(chats.data)
      } else {
        toast({
          title: 'No chats',
          description: "You have no chats.Start chatting now",
          status: 'warning',
          duration: 5000,
          position: 'top-center',
          isClosable: true,
        })
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    fetchChats()
  }, [fetchAgain])


  console.log('selected chat is',selectedChat);
  return (


    <>
      <Box
        height='87vh'
        width='450px'
        p={2}
        m={2}
        bg='white'
        borderRadius='10'
        overflowY='scroll'
      >

        <Box>
          
          <Box display='flex'
           alignItems='center'
           justifyContent='space-evenly'
          >

          <Text  >My Chats</Text>
          <Button onClick={onOpen}>Create group chat</Button>
          </Box>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
              display='flex'
              flexDirection='column'
              alignItems='center'
            >
              <ModalHeader>
                Create group
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack>
                  <Box display='flex'
                  justifyContent='space-around'
                  alignItems='center'
                  w='300' >
                    {/* <Text>Name</Text> */}
                    <Input placeholder='Group name' onChange={(e)=>setGroupName(e.target.value)} />
                  </Box>
                  <Box display='flex' >
                    {/* <Text>Members</Text> */}
                    <Input placeholder='Search Members' onChange={(e) => searchApi(e.target.value, userData)} />
                  </Box>

                   <Box
                    display='flex'
                    flexWrap={true}
                   >
                     
                     {groupMember?.map((member)=>{
                      return(
                            <Box 
                             mx='1.3'
                             bg='green.300'
                             color='white'
                             padding='3px'
                             borderRadius='5px'
                             fontSize='17'
                             display='flex'
                             alignItems='center'
                             justifyContent='space-between'
                             fontFamily={['Inter','sans-serif']}
                            >
                               <Text>{member.name}</Text>
                               <RxCross2 
                                 cursor='pointer'
                                 fontSize='20'
                                 onClick={()=>removeMember(member)}
                               />
                            </Box>
                      )
                     })}

                   </Box>
                  <Box
                    overflowY='scroll'
                    maxH='200px'
                  >

                    <AddGroupMember setGroupMembers={setGroupMembers} userList={userList} />

                  </Box>

                  <Button onClick={createGroup} >Create group</Button>
                </Stack>
              </ModalBody>

            </ModalContent>
          </Modal>
        </Box>
        {chatList && chatList.map((chats) => {
          return (
           
            <Box
              key={chats._id}
              display='flex'
              alignItems='center'
              bg={(selectedChat)?(selectedChat._id===chats._id)?'gray.600':'gray.200':'gray.200'}
              color={(selectedChat)?(selectedChat._id===chats._id)?'white':{}:{}}
              m='2'
              padding={2}
              borderRadius={10}

            onClick={()=>setSelectedChat(chats)}
            >
              <Avatar name={(chats.isGroupChat) ? chats.chatName : chats.users[0]._id === userData._id ? chats.users[1].name : chats.users[0].name} src={(chats.isGroupChat) ? {} : chats.users[0]._id === userData._id ? chats.users[1].profImage : chats.users[0].profImage} />
              <Text
                px={4}
              >{(chats.isGroupChat) ? chats.chatName : chats.users[0]._id === userData._id ? chats.users[1].name : chats.users[0].name}</Text>
            </Box>

          )
        })}

      </Box>
    </>
  )
}

export default MyChats