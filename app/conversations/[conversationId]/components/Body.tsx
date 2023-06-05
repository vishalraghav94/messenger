"use client"
import useConversation from '@/app/hooks/useConversation';
import { FullMessageType } from '@/app/types'
import React, { useEffect, useRef, useState } from 'react'
import Message from './MessageBox';
import axios from 'axios';
import { pusherClient } from '@/app/libs/pusher';

export default function Body({
    initialMessages
}: {
    initialMessages: FullMessageType[]
}) {
    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);
    const {
        conversationId
    } = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`)
    }, [conversationId]);

    useEffect(() => {
        if (bottomRef && bottomRef.current) {
            bottomRef.current.scrollIntoView()
        }
    }, [bottomRef]);

    useEffect(() => {
        const messageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`)
            setMessages(messages => {
                if (messages.find(m => m.id === message.id)) {
                    return messages;
                }
                return messages.concat(message)
            });

            bottomRef?.current?.scrollIntoView();
        }
        const updateMessageHandler = (updatedMessage: FullMessageType) => {
            setMessages(messages => messages.map(m => m.id === updatedMessage.id ? updatedMessage : m))
        }
        pusherClient.subscribe(conversationId);
        if (bottomRef && bottomRef.current) {
            bottomRef.current.scrollIntoView()
        }
        pusherClient.bind('messages:new', messageHandler);
        pusherClient.bind('message:update', updateMessageHandler);

        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind('messages:new', messageHandler)
            pusherClient.unbind('message:update', updateMessageHandler);
        }
    }, [conversationId, bottomRef])

    return (
        <div
            className='
            flex-1
            overflow-y-auto
            '
        >
            {
                messages.map((message, i) => <Message
                    message={message}
                    isLast={i === messages.length - 1}
                    key={message.id}
                />)
            }
            <div ref={bottomRef} className='pt-24' />
        </div>
    )
}
