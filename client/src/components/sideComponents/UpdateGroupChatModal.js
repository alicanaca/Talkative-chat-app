import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from './UserBadgeItem'
import axios from 'axios'
import UserListItem from './UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
    const { selectedChat, user, setSelectedChat } = ChatState()
    const toast = useToast()

    const handleDelete = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admin can remove someone!",
                status: "error",
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
            const { data } = await axios.put("http://localhost:5000/chat/groupremove",
                {
                    chatId: selectedChat._id,
                    userId: user1._id
                }, config)
            setLoading(false)
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
            fetchMessages()
            setFetchAgain(!fetchAgain)
        } catch (error) {
            toast({
                title: "Error occurred!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            setLoading(false)
        }
    }

    const handleAdd = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User already in the group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admin can add someone!",
                status: "error",
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
            const { data } = await axios.put("http://localhost:5000/chat/groupadd",
                {
                    chatId: selectedChat._id,
                    userId: user1._id
                }, config)
            setLoading(false)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
        } catch (error) {
            toast({
                title: "Error occurred!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            setLoading(false)
        }
    }

    const handleRename = async () => {
        if (!groupChatName) { return }
        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put("http://localhost:5000/chat/rename",
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName
                }, config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: "An error occurred",
                description: "Failed to rename the chat",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            setRenameLoading(false)
        }
        setGroupChatName("")
    }

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`http://localhost:5000/user?search=${search}`, config)
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

    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontFamily={"Poppins"}
                        fontSize={"25px"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
                            {selectedChat.users.map(user => {
                                return <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleDelete(user)}
                                />
                            })}
                        </Box>
                        <FormControl display={"flex"}>
                            <Input
                                placeholder='Chat name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant={"solid"}
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add user to group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner size={"lg"} />
                        ) : (
                            searchResult?.map((user) => {
                                return <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAdd(user)}
                                />
                            })
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleDelete(user)}>
                            Leave group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal
