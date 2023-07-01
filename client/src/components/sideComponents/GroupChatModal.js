import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from './UserListItem'
import UserBadgeItem from './UserBadgeItem'

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [createLoading, setCreateLoading] = useState()
    const toast = useToast()
    const { user, chats, setChats } = ChatState()

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

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return
        }
        try {
            setCreateLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post("https://talkative-i08b.onrender.com/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((user) => { return user._id }))
            }, config)
            setCreateLoading(false)
            setChats([data, ...chats])
            onClose()
            toast({
                title: "New group chat created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        } catch (error) {
            toast({
                title: "An error occurred",
                description: "Failed to create the chat",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }
    }

    const handleGroup = (users) => {
        if (selectedUsers.includes(users)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return
        }
        setSelectedUsers([...selectedUsers, users])
    }

    const handleDelete = (user) => {
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== user._id))
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"25px"}
                        fontFamily={"Poppins"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        Create a new group chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        alignItems={"center"}
                        flexDir={"column"}
                    >
                        <FormControl>
                            <Input placeholder='Chat name' mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add users' mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
                            {selectedUsers.map(user => {
                                return <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleDelete(user)}
                                />
                            })}
                        </Box>
                        {loading ? <Spinner ml={"auto"} display={"flex"} /> :
                            searchResult?.slice(0, 4).map(user => {
                                return <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleGroup(user)}
                                />
                            })
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button isLoading={createLoading} colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Create chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal
