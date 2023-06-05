'use client'
import Avatar from '@/app/components/Avatar';
import { FullMessageType } from '@/app/types'
import clsx from 'clsx';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Image from 'next/image'
import ImageModal from '@/app/components/ImageModal';

export default function Message({
    message,
    isLast
}: {
    message: FullMessageType,
    isLast?: boolean
}) {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const session = useSession();
    const isOwn = session?.data?.user?.email === message?.sender?.email;
    const seenList = (message.seen || []).filter(user => user.email !== message.sender.email).map(user => user.name).join(', ');

    const container = clsx(`
        flex
        gap-3
        p-4
    `, isOwn && `justify-end`)

    const avatar = clsx(isOwn && "order-2");
    const body = clsx(`
        flex
        flex-col
        gap-0
    `, isOwn && 'items-end');

    const messageCls = clsx(`
        text-sm
        w-fit
        overflow-hidden
    `, isOwn ? `bg-sky-500 text-white` : `bg-gray-100`, message.image ? `rounded-md p-2 bg-gray-200` : `rounded-full py-2 px-3`)

    return (
        <>
            <ImageModal message={message} isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} />
            <div
                className={container}
            >
                <div className={avatar}>
                    <Avatar user={message.sender} />
                </div>
                <div className={body}>
                    <div className='flex items-center gap-1'>
                        <div className='text-sm text-gray-500'>
                            {message.sender.name}
                        </div>
                        <div className='text-xs text-gray-400'>
                            {
                                format(new Date(message.createdAt), 'p')
                            }
                        </div>
                    </div>
                    <div className={messageCls}>
                        {
                            message.image ? (
                                <Image src={message.image} alt="Image" width={288} height={288}
                                    className='
                            object-cover
                            cursor-pointer
                            hover:scale-110
                            transition
                            translate
                            rounded-md
                            '
                                    onClick={() => setIsImageModalOpen(true)}
                                    role="button"
                                />
                            ) : (
                                <div>
                                    {message.body}
                                </div>
                            )
                        }
                    </div>
                    {
                        isLast && isOwn && seenList.length > 0 && (
                            <div
                                className='
                        text-xs
                        font-light
                        text-gray-500
                        '
                            >
                                {
                                    `Seen by ${seenList}`
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}
