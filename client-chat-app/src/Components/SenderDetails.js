import React from 'react'
import { Text, Image,Box } from '@chakra-ui/react'
function SenderDetails({ sender }) {

    return (
        <>

            <Box
             display='flex'
             justifyContent='center'
             flexDirection='column'
             alignItems='center'
            >


                <Image
                    objectFit='cover'
                    borderRadius='full'
                    boxSize='150px'
                    src={sender.profImage}
                    alt={sender.name}
                />

                <Text fontSize='3xl' color='black' >
                    {sender.name}
                </Text>

            </Box>
        </>
    )
}

export default SenderDetails