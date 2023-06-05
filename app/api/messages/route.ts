import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'
import { pusherServer } from '@/app/libs/pusher';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const user = await getCurrentUser();

        const {
            message,
            conversationId,
            image
        } = body;

        if (!user?.id || !user?.email) {
            return new NextResponse('Unauthorized', {
                status: 404
            })
        }
        const createdMessage = await prisma.message.create({
            data: {
                body: message,
                image,
                conversation: {
                    connect: {
                        id: conversationId
                    }
                },
                sender: {
                    connect: {
                        id: user.id
                    }
                },
                seen: {
                    connect: {
                        id: user.id
                    }
                }
            },
            include: {
                seen: true,
                sender: true
            }
        });
        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: createdMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            }
        });
        await pusherServer.trigger(conversationId, 'messages:new', createdMessage);
        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

        updatedConversation.users.forEach(user => {
            pusherServer.trigger(user.email!, 'conversation:update', {
                id: conversationId,
                messages: [lastMessage]
            })
        })
        return NextResponse.json(createdMessage)
    } catch (e) {
        console.log(e)
        return new NextResponse('Internal error', {
            status: 500
        })
    }
}

