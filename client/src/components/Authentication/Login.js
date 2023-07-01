import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'

const Login = () => {
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const toast = useToast()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleShow = () => setShow(!show)

    const submitHandler = async () => {
        setLoading(true)
        if (!email || !password) {
            toast({
                title: "Please enter the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            const { data } = await axios.post("https://talkative-i08b.onrender.com/user/login", { email, password }, config)
            toast({
                title: "Login is successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            localStorage.setItem("User-info", JSON.stringify(data))
            setLoading(false)
            navigate("/chats")
        } catch (error) {
            toast({
                title: "An error occurred",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
        }
    }

    return (
        <VStack spacing={"5px"}>

            <FormControl id='logEmail' isRequired>
                <FormLabel>
                    Email
                </FormLabel>
                <Input
                    value={email}
                    placeholder='Enter your email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id='logPassword' isRequired>
                <FormLabel>
                    Password
                </FormLabel>
                <InputGroup size={"md"}>
                    <Input
                        value={password}
                        type={show ? 'text' : 'password'}
                        placeholder='Enter your password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width={"4.5rem"}>
                        <Button h={"1.75rem"} size={"sm"} onClick={handleShow}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                colorScheme='blue'
                width={"100%"}
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>

            <Button
                variant={"solid"}
                colorScheme='red'
                width={"100%"}
                style={{ marginTop: 15 }}
                onClick={() => {
                    setEmail("guest@example.com")
                    setPassword("123456")
                }}
            >
                Sign in as guest user
            </Button>

        </VStack>
    )
}

export default Login
