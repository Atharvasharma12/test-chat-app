import React from 'react'
import {
  Modal,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'

import { Image } from '@chakra-ui/react'
function DetailModal({ user }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  // console.log(user);
  return (

    <>
      <Text bg='transparent' onClick={onOpen}>My profile</Text>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay 
         display='flex'
         alignItems='center'
        >

          <ModalContent  >
            <ModalHeader>Hello User !</ModalHeader>
            <ModalCloseButton />
            <ModalBody display='flex' alignItems='center' flexDir='column'>
              <Image
                objectFit='cover'
                borderRadius='full'
                boxSize='150px'
                src={user.profImage}
                alt={user.name}
              />

               <Text fontSize='3xl' color='black' >
                {user.name}
               </Text>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  )
}

export default DetailModal