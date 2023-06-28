import React, { useState } from 'react'
import './Home.css'
import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator,Text, Container ,Box } from '@chakra-ui/react'
import Login from '../Components/Login'
import Register from '../Components/Register'
function Home() {

    
    return (
        <>
            
            <Container h='100vh' maxW='xl' >

            
                <Box bg='white' w='xl' borderRadius='12px' padding='30px' pos='absolute' left='73px' top='23px'>

                <Text fontSize='30px' textAlign='center' padding='4' >Chat app</Text>
                <Tabs position="relative" align='center' variant="unstyled">
                    <TabList>
                        <Tab>Sign in</Tab>
                        <Tab>Sign up</Tab>
                    </TabList>
                    <TabIndicator
                        mt="-1.5px"
                        height="2px"
                        bg="blue.500"
                        borderRadius="1px"
                        />
                    <TabPanels>
                        <TabPanel>
                            <Login/>
                        </TabPanel>
                        <TabPanel>
                            <Register/>
                            
                        </TabPanel>
                        
                    </TabPanels>
                </Tabs>
                </Box>
                </Container>
        </>
    )
}

export default Home