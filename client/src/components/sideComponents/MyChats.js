import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, Text, useToast, Button, Stack } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading'
import axios from 'axios'
import { getSender } from '../../config/ChatLogics'
import GroupChatModal from './GroupChatModal'
import NotificationBadge, { Effect } from 'react-notification-badge'

const MyChats = ({ fetchAgain, notifSend }) => {
    const [loggedUser, setLoggedUser] = useState()
    const { selectedChat, setSelectedChat, chats, setChats, user, uniqueChat } = ChatState()
    const toast = useToast()

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get("https://talkative-i08b.onrender.com/chat", config)
            setChats(data)
        } catch (error) {
            toast({
                title: "An error occurred",
                description: "Failed to fetch chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }
    }

    useEffect(() => {
        console.log(uniqueChat)
    }, [notifSend])

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("User-info")))
        // console.log(chats)
        fetchChats()
    }, [fetchAgain])

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir={"column"}
            alignItems={"center"}
            p={3}
            bg={"white"}
            w={{ base: "100%", md: "30%" }}
            borderRadius={"lg"}
            borderWidth={"1px"}
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily={"Poppins"}
                display={"flex"}
                w={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                My chats
                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        New group chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY={"scroll"}>
                        {chats.map((chat) => {
                            // console.log(chat)
                            const hasNotification = uniqueChat.find(e => e.chat._id === chat._id)
                            // console.log(uniqueChat.find(e => e.chat._id === chat._id))
                            return <Box
                                onClick={() => { setSelectedChat(chat) }}
                                cursor={"pointer"}
                                bg={hasNotification ? "#73d96e" : (selectedChat === chat ? "#38B2AC" : "#E8E8E8")}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius={"lg"}
                                key={chat._id}
                            >
                                <Text
                                    fontFamily={"Poppins"}
                                    fontSize={"xl"}
                                >
                                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) :
                                        chat.chatName}
                                </Text>
                                {chat.latestMessage ?
                                    <Box display={"flex"} flexDir={"row"} fontSize={"small"}>
                                        <Text style={{ fontWeight: "bold" }}>
                                            {`${chat.latestMessage.sender.name}:`}
                                            &nbsp;
                                        </Text>
                                        <Text>
                                            {chat.latestMessage.content}
                                        </Text>
                                        {hasNotification ?
                                            <NotificationBadge
                                                style={{ marginTop: "3px", backgroundColor: "#a9a961", color: "white" }}
                                                count={hasNotification.count}
                                                effect={Effect.ROTATE_Y}
                                            />
                                            : <></>
                                        }
                                    </Box> : <></>
                                }
                            </Box>
                        })}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    )
}

export default MyChats
