import getConversationById from '@/app/actions/getConversationById'
import EmptyState from '@/app/components/EmptyState'
import React, { useMemo } from 'react'
import Header from './components/Header'
import { FullConversationType, FullMessageType } from '@/app/types'
import Body from './components/Body'
import Form from './components/Form'

interface IParams {
    conversationId: string
}

const ConversationId = async ({ params }: {
    params: IParams
}) => {
    const conversation = await getConversationById(params.conversationId)
    const messages = conversation?.messages || [];
    if (!conversation) {
        return (
            <div
                className='
        h-full lg:pl-80
        '
            >
                <div className='h-full flex flex-col'>
                    <EmptyState />
                </div>
            </div>
        )
    }
    return (
        <div className='
            lg:pl-80
            h-full
        '>
            <div className='
            h-full flex flex-col
            '>
                <Header conversation={conversation as FullConversationType} />
                <Body initialMessages={messages as FullMessageType[]} />
                <Form />
            </div>
        </div>
    )
}

export default ConversationId;


