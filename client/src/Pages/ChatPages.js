import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/sideComponents/SideDrawer'
import MyChats from '../components/sideComponents/MyChats'
import ChatBox from '../components/sideComponents/ChatBox'

function ChatPages() {
    const { user } = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false)
    const [notifSend, setNotifSend] = useState(false)

    useEffect(() => {
    }, [])

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box
                display="flex"
                justifyContent="space-between"
                w="100%"
                h="91.5vh"
                p="10px"
            >
                {user && <MyChats fetchAgain={fetchAgain} notifSend={notifSend} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} notifSend={notifSend} setNotifSend={setNotifSend} />}
            </Box>
        </div>
    )
}

export default ChatPages
