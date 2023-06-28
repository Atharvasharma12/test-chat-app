import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import {
    Button,
    VStack,
    FormControl,
    FormLabel,
    Input
} from '@chakra-ui/react'
function Login() {
    const [email, setEmail] = useState();
    const [passw, setPassw] = useState();
    const navigate = useNavigate();
    const loginData = {
        email: email,
        password: passw
    }
    const loginHandler = async () => {
        const res = await axios.post('/login', loginData)
        if (res.status === 200) {
            window.alert('login successful')
            console.log(res.data);
            localStorage.setItem('userInfo',JSON.stringify(res.data))
            navigate('/chatPage')
        }else if(res.status===203){
            window.alert(res.data.message)
        }
    }

    return (
        <div>
            <VStack
                spacing='9px'
                align='stretch'
            >

                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input onChange={(e) => setEmail(e.target.value)} placeholder='example@email.com' ></Input>
                </FormControl>

                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input onChange={(e) => setPassw(e.target.value)} type='password' placeholder='password' ></Input>
                </FormControl>

                <Button colorScheme='blue' onClick={loginHandler} >
                    Sign in
                </Button>
            </VStack>
        </div>
    )
}

export default Login