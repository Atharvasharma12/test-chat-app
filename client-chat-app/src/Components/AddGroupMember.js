import React from 'react'
import { Box, Avatar, Text, Stack, Button,useToast } from '@chakra-ui/react'
function AddGroupMember({ setGroupMembers, userList }) {
    const toast = useToast();
    return (
        <>
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
                        onClick={()=>setGroupMembers((prev)=>{
                            if(prev.includes(user))
                            {
                                toast({
                                    title: 'already selected',
                                    // description: "No such user found.",
                                    status: 'warning',
                                    duration: 5000,
                                    position: 'bottom-left',
                                    isClosable: true,
                                  })
                                  return prev;
                            }
                            // console.log('prev',prev);
                            return [...prev,user]
                        })}
                    
                    >
                        <Avatar name={user.name} src={user.profImage} />
                        <Text
                            px={4}
                            
                        >{user.name}
                        </Text>
                         
                    </Box>
                )
            })}

        </>
    )
}

export default AddGroupMember