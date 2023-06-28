import React, { useState, useContext } from 'react'
import { Text, Input, Box, Button } from '@chakra-ui/react'
// import axios from 'axios'
import axios, * as others from 'axios';
import { userContext } from '../Context/UserProvider'
import { useToast, Avatar, Stack } from '@chakra-ui/react'
import { RxCross2 } from 'react-icons/rx';

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
function UpdateGroupModal({ fetchAgain, setFetchAgain, onClose }) {
  const { userData, selectedChat, setSelectedChat } = useContext(userContext)
  const toast = useToast();
  const [groupName, setGroupName] = useState();
  const [userList, setUserList] = useState([])
  const [groupMember, setGroupMembers] = useState([])
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

  const removeMember = async (member) => {

    try {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rId: member._id,
          grpId: selectedChat._id
        })
      };
      const res = await fetch('/removeFromGrp', requestOptions)
      console.log(res.body);
      const data = await res.json();
      console.log("data is",data);
      if(res.status===201)
      window.alert(data.message)

      setFetchAgain(!fetchAgain)

      
      if (data.users.length === 0 || member._id === userData._id) {
        
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grpId: selectedChat._id
          })
        };
        const res = await fetch('/deleteGroup', requestOptions)
        const data = await res.json();
        setFetchAgain(!fetchAgain)
        console.log("deleted grp",data);
        setSelectedChat()
        onClose();

        return;
      }
      setSelectedChat(data)
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }



  }


  const updateGroup = async () => {
    try {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grpId: selectedChat._id,
          newname: groupName
        })
      };  
      const res = await fetch('/renameGroup', requestOptions)
      const data = await res.json();
      console.log(data);

      setFetchAgain(!fetchAgain)
      setSelectedChat(data)
    }
    catch (error) {
      console.log(error.message);
    }
  }


  console.log(selectedChat.groupAdmin._id);
  console.log(userData._id);
  return (
    <Box>
      <Stack>
        <Box display='flex'
          justifyContent='space-around'
          alignItems='center'
          w='300' >
          {/* <Text>Name</Text> */}
          <Input placeholder='Group name' onChange={(e) => setGroupName(e.target.value)} />
        </Box>
        <Box display='flex' >
          {/* <Text>Members</Text> */}
          <Input placeholder='Search Members' onChange={(e) => searchApi(e.target.value, userData)} />
        </Box>

        <Box
          display='flex'
          flexWrap={true}
        >

          {selectedChat.users?.map((member) => {
            return (



              <Box
                mx='1.3'
                //  bg='green.300'
                display='flex'
                color='white'
                padding='4px'
                paddingLeft='7px'
                borderRadius='5px'
                fontSize='17'
                alignItems='center'
                justifyContent='space-between'
                fontFamily={['Inter', 'sans-serif']}
                key={member._id}
                bg={(member._id === userData._id) ? 'green.800' : 'green.400'}
              >
                <Text>{(member._id === userData._id) ? "You" : member.name}</Text>


                <Box
                  display={(selectedChat.groupAdmin._id === userData._id) ? {} : 'none'}
                >

                  <RxCross2

                    cursor='pointer'
                    fontSize='20'
                    onClick={() => removeMember(member)}
                  />
                </Box>

              </Box>



            )
          })}

        </Box>
        <Box
          overflowY='scroll'
          maxH='200px'
        >



        </Box>

        <Button onClick={updateGroup} >Update group</Button>
      </Stack>
    </Box>
  )
}

export default UpdateGroupModal