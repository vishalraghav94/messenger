"use client"

import { User } from '@prisma/client'
import React from 'react'
import Image from 'next/image'

interface AvatarGroup {
    users: User[]
}
export default function AvatarGroup({
    users = []
}: AvatarGroup) {
    const slicedUsers = users.slice(0, 3);

    const positionMap = {
        0: 'top-0 left-[12px]',
        1: 'bottom-0',
        2: 'bottom-0 right-0'
    }

    return (
        <div
            className='
                relative
                h-11
                w-11
            '
        >
            {
                slicedUsers.map((user, i) => {
                    return <div key={user.id} className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px] ${positionMap[i as keyof typeof positionMap]}`}>
                        <Image alt="avatar" fill src={user.image || '/images/placeholder.png'} />
                    </div>
                })
            }
        </div>
    )
}
