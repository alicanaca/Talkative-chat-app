import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
    return (
        <Stack>
            <Skeleton height={"65px"} />
            <Skeleton height={"65px"} />
            <Skeleton height={"65px"} />
            <Skeleton height={"65px"} />
            <Skeleton height={"65px"} />
            <Skeleton height={"65px"} />
            <Skeleton height={"65px"} />
            <Skeleton height={"65px"} />
            <Skeleton height={"65px"} />
            <Skeleton height={"65px"} />
            <Skeleton height={"65px"} />
        </Stack>
    )
}

export default ChatLoading
