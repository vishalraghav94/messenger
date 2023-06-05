"use client"

import useConversation from '@/app/hooks/useConversation'
import { FullConversationType } from '@/app/types'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { MdOutlineGroupAdd } from 'react-icons/md'
import ConversationBox from './ConversationBox'
import GroupChatModal from './GroupChatModal'
import { User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { pusherClient } from '@/app/libs/pusher'

export default function ConversationList({
    initialItems,
    users
}: {
    initialItems: FullConversationType[],
    users: User[]
}) {
    const session = useSession()
    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const {
        conversationId,
        isOpen
    } = useConversation();

    const pusherKey = useMemo(() => {
        return session.data?.user?.email || ''
    }, [session.data?.user?.email]);

    useEffect(() => {
        const conversationHandler = (newConversation: FullConversationType) => {
            setItems(items => {
                if (items.find(item => item.id === newConversation.id)) {
                    return items;
                }

                return [newConversation, ...items]
            })
        }

        const updatedConversationHandler = (newConversation: FullConversationType) => {
            setItems(items => items.map(item => item.id === newConversation.id ? ({
                ...item,
                messages: [...item.messages, ...newConversation.messages]
            }) : item))
        }

        const removeHandler = (conversation: FullConversationType) => {
            setItems(items => {
                const index = items.findIndex(item => item.id === conversation.id);
                const newItems = [...items];
                newItems.splice(index, 1);
                return newItems;
            })

            if (conversation.id === conversationId) {
                router.push('/conversations')
            }
        }

        pusherClient.subscribe(pusherKey);
        pusherClient.bind('conversation:new', conversationHandler);
        pusherClient.bind('conversation:update', updatedConversationHandler);
        pusherClient.bind('conversation:remove', removeHandler);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind('conversation:new', conversationHandler);
            pusherClient.unbind('conversation:update', updatedConversationHandler);
            pusherClient.unbind('conversation:remove', removeHandler);
        }
    }, [pusherKey, conversationId, router])

    return (
        <>
            <GroupChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} users={users} />
            <aside
                className={
                    clsx(`
                fixed
                inset-y-0
                pb-20
                lg:pb-0
                lg:left-20
                lg:w-80
                lg:block
                overflow-y-auto
                border-r
                border-gray-200
            `, isOpen ? 'hidden' : 'block w-full left-0')
                }
            >
                <div
                    className='px-5'
                >
                    <div className='flex justify-between mb-4 pt-4'>
                        <div
                            className='
                        text-2xl
                        font-bold
                        text-neutral-800
                        '
                        >
                            Messages
                        </div>
                        <div
                            className='
                            rounded-full
                            p-2
                            bg-gray-100
                            text-gray-600
                            cursor-pointer
                            hover:bg-black
                            hover:text-neutral-50
                            transition
                            '
                            onClick={() => setIsModalOpen(true)}
                            role="button"
                        >
                            <MdOutlineGroupAdd size={20} />
                        </div>
                    </div>
                    {
                        items.map((item) => <ConversationBox key={item.id} data={item} selected={conversationId === item.id} />)
                    }
                </div>
            </aside>
        </>
    )
}
