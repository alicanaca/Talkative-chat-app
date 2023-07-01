import React, { useEffect, useState } from 'react'
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import { useNavigate } from 'react-router-dom'
import ProfileModal from './ProfileModal'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import UserListItem from './UserListItem'
import { getSender } from '../../config/ChatLogics'
import NotificationBadge, { Effect } from 'react-notification-badge'

const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
    // const [uniqueChat, setUniqueChat] = useState([])
    const { user, setSelectedChat, chats, setChats, notification, setNotification, uniqueChat } = ChatState()
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const logout = () => {
        // localStorage.removeItem("User-info")
        localStorage.clear()
        setTimeout(() => {
            navigate("/")
        }, 200);
    }

    // useEffect(() => {
    //     uniqueHandler()
    // }, [])

    // const uniqueHandler = () => {

    //     const uniqueArray = notification.reduce((accumulator, item) => {
    //         const foundItem = accumulator.find(obj => obj.chat._id === item.chat._id);
    //         if (foundItem) {
    //             foundItem.count++;
    //         } else {
    //             accumulator.push({ ...item, count: 1 });
    //         }
    //         return accumulator;
    //     }, []);

    //     setUniqueChat(uniqueArray)
    // }

    // useEffect(() => {
    //     sendNotification()
    // }, [sendNotif])

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please enter a search value",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`https://talkative-i08b.onrender.com/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: "An error occurred",
                description: "Failed to fetch the users",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }
    }

    // const sendNotification = async () => {

    //     const uniqueArray = notification.reduce((accumulator, item) => {
    //         const foundItem = accumulator.find(obj => obj.chat._id === item.chat._id);
    //         if (foundItem) {
    //             foundItem.count++;
    //         } else {
    //             accumulator.push({ ...item, count: 1 });
    //         }
    //         return accumulator;
    //     }, []);

    //     // console.log(notification)
    //     // console.log(uniqueChat)
    //     // console.log(uniqueArray)

    //     try {
    //         const config = {
    //             headers: {
    //                 Authorization: `Bearer ${user.token}`
    //             }
    //         }

    //         const { data } = await axios.post(`http://localhost:5000/notif`, {
    //             chat: uniqueArray[0].chat,
    //             sender: uniqueArray[0].sender,
    //             count: uniqueArray[0].count,
    //             content: uniqueArray[0].content,
    //         }, config)

    //         console.log(data)
    //     } catch (error) {
    //         toast({
    //             title: "Error Occured!",
    //             description: "Failed to send the notif",
    //             status: "error",
    //             duration: 5000,
    //             isClosable: true,
    //             position: "top"
    //         })
    //     }
    // }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post("https://talkative-i08b.onrender.com/chat", { userId }, config)
            if (!chats.find((c) => c._id === data._id)) { setChats([data, ...chats]) }
            setLoadingChat(false)
            setSelectedChat(data)
            onClose()
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

    return (
        <>
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                bg={"white"}
                w={"100%"}
                p={"5px 10px 5px 10px"}
                borderWidth={"5px"}
            >
                <Tooltip
                    label="Search for users to chat"
                    hasArrow
                    placement="bottom-end"
                >
                    <Button variant={"ghost"} onClick={onOpen}>
                        <i className='fas fa-search'></i>
                        <Text display={{ base: "none", md: "flex" }} px={"4"}>
                            Search Users
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize={"2xl"} fontFamily={"Poppins"}>Talkative</Text>

                <div>

                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList
                            pl={2}
                            display={"flex"}
                            flexDir={"column"}
                            justifyContent={"center"}
                        >
                            {!notification.length && "No new messages"}
                            {uniqueChat.map(not => {
                                return <MenuItem key={not._id} onClick={() => {
                                    setSelectedChat(not.chat)
                                    setNotification(notification.filter((n) => n !== not))
                                }}>
                                    {not.chat.isGroupChat ? (
                                        not.count > 1 ? `${not.count} new messages in ${not.chat.chatName}` :
                                            `New message in ${not.chat.chatName}`
                                    ) : (
                                        not.count > 1 ? `${not.count} new messages from ${getSender(user, not.chat.users)}` :
                                            `New message from ${getSender(user, not.chat.users)}`
                                    )}
                                </MenuItem>
                            })}
                        </MenuList>
                    </Menu>

                    <Menu>
                        <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                        >
                            <Avatar
                                size={"sm"}
                                cursor={"pointer"}
                                name={user.name}
                                src={user.pic}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>

                </div>
            </Box>

            <Drawer
                placement='left'
                onClose={onClose}
                isOpen={isOpen}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={"1px"}>
                        Search for users
                    </DrawerHeader>
                    <DrawerBody>
                        <Box
                            display={"flex"}
                            pb={2}
                        >
                            <Input
                                placeholder='Search by name/email'
                                mr={2}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                }}
                            />
                            <Button onClick={handleSearch}>Search</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map(user => {
                                return <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            })
                        )}
                        {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer
