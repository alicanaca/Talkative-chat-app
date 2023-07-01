import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'

const Signup = () => {
    const [show, setShow] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [pic, setPic] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    const handleShow = () => setShow(!show)

    const postDetails = (pics) => {
        setLoading(true)
        if (pics === undefined) {
            toast({
                title: "Please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return
        }
        if (pics.type === "image/jpeg" || pics.type === "image/jpg" || pics.type === "image/png") {
            const data = new FormData()
            data.append("file", pics)
            data.append("upload_preset", "chat-app")
            data.append("cloud_name", "dluukw87q")
            fetch("https://api.cloudinary.com/v1_1/dluukw87q/image/upload", {
                method: "post",
                body: data
            }).then((res) => res.json()).then((data) => {
                setPic(data.url.toString())
                console.log(data.url.toString());
                setLoading(false)
            }).catch((err) => {
                console.log(err)
                setLoading(false)
            })
        } else {
            toast({
                title: "Please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return
        }
    }

    const submitHandler = async () => {
        setLoading(true)
        if (!name || !email || !password || !confirm) {
            toast({
                title: "Please fill the necessary informations",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return
        }
        if (password !== confirm) {
            toast({
                title: "Passwords do not match",
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
            const { data } = await axios.post("https://talkative-i08b.onrender.com/user", { name, email, password, pic }, config)
            toast({
                title: "Registration is successful",
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

            <FormControl id='name' isRequired>
                <FormLabel>
                    Name
                </FormLabel>
                <Input
                    placeholder='Enter your name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>

            <FormControl id='email' isRequired>
                <FormLabel>
                    Email
                </FormLabel>
                <Input
                    placeholder='Enter your email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>
                    Password
                </FormLabel>
                <InputGroup size={"md"}>
                    <Input
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

            <FormControl id='confirm' isRequired>
                <FormLabel>
                    Confirm password
                </FormLabel>
                <InputGroup size={"md"}>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Enter the password again'
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                    <InputRightElement width={"4.5rem"}>
                        <Button h={"1.75rem"} size={"sm"} onClick={handleShow}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='pic'>
                <FormLabel>
                    Upload a profile picture
                </FormLabel>
                <Input
                    type='file'
                    p={1.5}
                    accept='image/*'
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>

            <Button
                colorScheme='blue'
                width={"100%"}
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign up
            </Button>
        </VStack>
    )
}

export default Signup
