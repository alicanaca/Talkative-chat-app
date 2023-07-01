import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, Button, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../../config/ChatLogics'
import { Player } from '@lottiefiles/react-lottie-player'
import ProfileModal from './ProfileModal'
import UpdateGroupChatModal from './UpdateGroupChatModal'
import axios from 'axios'
import '../styles.css'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'
import typingAnimation from '../../animations/typing.json'
import sendingAnimation from '../../animations/send.json'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ENDPOINT = "http://localhost:5000"
var socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain, notifSend, setNotifSend }) => {
    const { user, selectedChat, setSelectedChat, notification, setNotification, uniqueChat, setUniqueChat } = ChatState()
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [send, setSend] = useState(false)
    const [timerId, setTimerId] = useState(null);
    const toast = useToast()

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit('setup', user)
        socket.on('connected', () => {
            setSocketConnected(true)
        })
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
    }, [])

    useEffect(() => {
        fetchMessages()
        setNotification(notification?.filter((n) => n.chat._id !== selectedChat._id))
        selectedChatCompare = selectedChat
    }, [selectedChat])

    useEffect(() => {
        socket.on('message received', async (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification])

                    setFetchAgain(!fetchAgain)
                }

            } else {
                setMessages([...messages, newMessageReceived])
            }
        })
    })

    useEffect(() => {
        const uniqueArray = notification?.reduce((accumulator, item) => {
            const foundItem = accumulator?.find(obj => obj.chat._id === item.chat._id);
            if (foundItem) {
                foundItem.count++;
            } else {
                accumulator.push({ ...item, count: 1 });
            }
            return accumulator;
        }, []);

        setUniqueChat(uniqueArray)
    })



    const fetchMessages = async () => {
        if (!selectedChat) { return }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true)
            const { data } = await axios.get(`https://talkative-i08b.onrender.com/messages/${selectedChat._id}`, config)
            setLoading(false)
            setMessages(data)
            socket.emit('join chat', selectedChat._id)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to load the messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }
    }

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            socket.emit('stop typing', selectedChat._id)

            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                setNewMessage("")
                setSend(true)

                const { data } = await axios.post("https://talkative-i08b.onrender.com/messages", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)

                socket.emit('new message', data)
                setTimeout(() => {
                    setSend(false)
                }, 600);
                setFetchAgain(!fetchAgain)
                setNotifSend(!notifSend)
                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                })
            }
        }
    }

    const buttonHandler = async () => {
        if (!newMessage) { return }

        socket.emit('stop typing', selectedChat._id)

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            setNewMessage("")
            setSend(true)
            const { data } = await axios.post("https://talkative-i08b.onrender.com/messages", {
                content: newMessage,
                chatId: selectedChat._id
            }, config)

            socket.emit('new message', data)
            setTimeout(() => {
                setSend(false)
            }, 600);
            setMessages([...messages, data])
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to send the message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            setSend(false)
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        if (!socketConnected) { return }

        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }

        const timerLength = 3000;

        if (timerId) {
            clearTimeout(timerId);
        }

        let timer = setTimeout(() => {
            socket.emit('stop typing', selectedChat._id);
            setTyping(false);

        }, timerLength);

        setTimerId(timer);

        // let lastTypingTime = new Date().getTime()
        // var timerLength = 3000

        // setTimeout(() => {
        //     var timeNow = new Date().getTime()
        //     var timeDiff = timeNow - lastTypingTime

        //     if (timeDiff >= timerLength && typing) {
        //         socket.emit('stop typing', selectedChat._id)
        //         setTyping(false)
        //     }
        // }, timerLength);
    }

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w={"100%"}
                        fontFamily={"Poppins"}
                        display={"flex"}
                        justifyContent={{ base: "space-between" }}
                        alignItems={"center"}
                    >
                        <IconButton
                            display={{ base: "flex", md: "flex" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (<>
                            {getSender(user, selectedChat.users)}
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                        </>) :
                            (<>
                                {selectedChat.chatName.toUpperCase()}
                                {<UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />}
                            </>)}
                    </Text>
                    <Box
                        display={"flex"}
                        flexDir={"column"}
                        justifyContent={"flex-end"}
                        p={3}
                        bg={"#E8E8E8"}
                        w={"100%"}
                        h={"100%"}
                        borderRadius={"lg"}
                        overflowY={"hidden"}
                    >
                        {loading ? (<Spinner
                            size={"xl"}
                            w={20}
                            h={20}
                            alignSelf={"center"}
                            margin={"auto"}
                        />) : (<div className='messages'>
                            <ScrollableChat messages={messages} />
                        </div>)}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping ? <div>
                                <Player
                                    src={typingAnimation}
                                    loop
                                    autoplay
                                    rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
                                    style={{ width: "45px", marginBottom: "10px", marginLeft: "0" }}
                                />
                            </div> : (<></>)}
                            <Box
                                display={"flex"}
                                flexDir={"row"}
                                justifyContent={"space-between"}
                            >
                                <Input
                                    variant={"filled"}
                                    placeholder='Enter a message...'
                                    bg={"#E0E0E0"}
                                    onChange={typingHandler}
                                    value={newMessage}
                                />
                                {send ? <Player
                                    src={sendingAnimation}
                                    speed={4}
                                    autoplay={true}
                                    loop={true}
                                    rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
                                    style={{ width: "43px", marginBottom: "15", marginLeft: "0", marginTop: "10px" }}
                                /> :
                                    <Button onClick={buttonHandler} className={"fa-solid fa-paper-plane fa-2xs"} />
                                }
                            </Box>
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} h={"100%"}>
                    <Text fontSize={"3xl"} pb={3} fontFamily={"Poppins"}>
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat
