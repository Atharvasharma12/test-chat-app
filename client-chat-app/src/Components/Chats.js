import React, { useContext, useEffect, useState } from 'react'
import { Box, Image, Input, Text, Button } from '@chakra-ui/react'
import { userContext } from '../Context/UserProvider'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';
import { Stack, HStack, VStack, Avatar } from '@chakra-ui/react'
import ScrollableFeed from 'react-scrollable-feed'
import axios from 'axios';
import io from "socket.io-client"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import UpdateGroupModal from './UpdateGroupModal';
import SenderDetails from './SenderDetails';


var ENDPOINT = "http://localhost:8000"
var socket, compareSelectedChat;
function Chats({ fetchAgain, setFetchAgain }) {
  const { userData, chatList, setChatList, selectedChat, setSelectedChat } = useContext(userContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [NewMessage, setNewMessage] = useState();
  const [Messages, setMessages] = useState([]);
  // const [TypingHandler,setTypingHandler]=useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  useEffect(() => {
    socket = io(ENDPOINT)
    // console.log(socket);

    socket.emit("setup", userData);
    socket.on('connected', (room) => {
      console.log("connected to room ", room)
    });

  }, [])
  const TypingHandler = (e) => {
    setNewMessage(e.target.value);


  }
  const sendMessage = async () => {
    if (NewMessage === "") {
      toast({
        title: "Write some message",
        // description: "No such user found.",
        status: 'warning',
        duration: 5000,
        position: 'bottom-left',
        isClosable: true,
      })
      return;
    }

    try {

      setNewMessage("");
      const { data } = await axios.post('/sendMessage', {
        chatID: selectedChat._id,
        userId: userData._id,
        content: NewMessage
      })
      // console.log(data);
      console.log("sending new message here");
      socket.emit('Hello', data);
      //  fetchMessages();
      setMessages([...Messages, data]);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`/allMessages?chat=${selectedChat._id}`)
      console.log(data);
      setMessages(data);
      setLoading(true);
      socket.emit('join-chat', selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setLoading(false)
    fetchMessages();
    compareSelectedChat = selectedChat;
    setMessages([]);
  }, [selectedChat])

  useEffect(() => {
    // socket.on('hii', (msgreceived) => {

    //   console.log("message received on client side ",msgreceived);
    //   console.log("compare ",compareSelectedChat);
    //   if (!compareSelectedChat || compareSelectedChat !== msgreceived.chat.sender) {
    //     console.log(" notification work required");
    //   }
    //   else {
    //     setMessages([...Messages, msgreceived]);
    //   }
    // })

    socket.on('hii', (data) => {
      console.log("hiiiiiii");
      // console.log('compare ', compareSelectedChat._id === data.chat._id);
      console.log("user", compareSelectedChat);
      console.log("sender", data.chat);
      if (!compareSelectedChat || compareSelectedChat._id === data.chat._id) {
        setMessages([...Messages, data]);
      }
      else {
        console.log(" notification work required");
        
      
      }
    })
  })


  return (
    <>
      <Box
        height='87vh'
        width='350px'
        p={2}
        // paddingBottom={2}
        m={2}
        bg='white'
        // bg='black'

        w='8xl'
        borderRadius='10'
      >

        {
          !selectedChat ?
            <Box
              display='flex'
              alignItems='center'
              justifyContent='center'
              height='85vh'
              fontSize='30px'
            //  bg='aqua'
            >
              <Text>Select someone to start chat.</Text>
            </Box>
            :
            <Box>

              <Box
                bg='aliceblue'
                height='60px'
                borderTopRadius='10px'
                p='8px'
                display='flex'
                alignItems='center'
                justifyContent='space-between'
              >
                <Text>

                  {(selectedChat.isGroupChat) ? selectedChat.chatName : selectedChat.users[0]._id === userData._id ? selectedChat.users[1].name : selectedChat.users[0].name}

                </Text>

                <BsThreeDotsVertical
                  cursor='pointer'
                  onClick={onOpen}
                />


                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>{(selectedChat.isGroupChat) ? selectedChat.chatName : selectedChat.users[0]._id === userData._id ? selectedChat.users[1].name : selectedChat.users[0].name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      {
                        (selectedChat.isGroupChat) ?
                          <UpdateGroupModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} onClose={onClose} />
                          :
                          <SenderDetails sender={selectedChat.users[0]._id === userData._id ? selectedChat.users[1] : selectedChat.users[0]} />
                      }
                    </ModalBody>

                    <ModalFooter>

                    </ModalFooter>
                  </ModalContent>
                </Modal>

              </Box>




              {/* <Box
                bg='green.100'
                height='75vh'
                borderBottomRadius='10px'
                display='flex'
                alignItems='flex-end'
                flexDirection='column'
                p={2}
              > */}


              <VStack
                // divider={<StackDivider borderColor='gray.200' />}
                spacing={0}
                align='stretch'
                bg='green.100'
              >
                <Box h='68vh' bg='green.100' p={0}  >
                  {
                    !loading ?
                      <Spinner size='xl' /> :

                      <ScrollableFeed>

                        {Messages.map((msg) => {
                          return (
                            <Box display='flex'
                              alignItems='center'
                              justifyContent={(msg.sender._id == userData._id) ? 'flex-end' : 'flex-start'}
                              //  bg='whatsapp.200'
                              padding={1}
                              key={msg._id}
                            >
                              {
                                (msg.sender._id === userData._id)
                                  ? <></> :
                                  <Avatar size='sm' name={msg.sender.name} src={msg.sender.profImage} />
                              }
                              <Box key={msg._id} padding='10px' paddingTop='2' bg="blue.100" m='1' borderRadius='20' >
                                {msg.content}
                              </Box>
                            </Box>
                          )
                        })}
                      </ScrollableFeed>
                  }
                </Box>

                <Box bg='green.100' >

                  <Box
                    width="100%"
                    display="flex"
                  >
                    <Input value={NewMessage} onChange={TypingHandler} bg='white' ></Input>
                    <Button onClick={sendMessage}><FiSend /></Button>
                  </Box>


                </Box>
              </VStack>


              {/* <Box>


                  {
                    !loading ?
                      <Spinner size='xl' /> :
                      <div>Hello</div>
                  }

                </Box>
                <Box
                  width="100%"
                  display="flex"
                >
                  <Input onChange={(e) => setNewMessage(e.target.value)} bg='white' ></Input>
                  <Button onClick={sendMessage}><FiSend /></Button>
                </Box> */}

              {/* </Box> */}

            </Box>
        }

      </Box>
    </>
  )
}

export default Chats