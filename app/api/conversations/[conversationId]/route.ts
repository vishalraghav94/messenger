import getCurrentUser from '@/app/actions/getCurrentUser';
import prismadb from '@/app/libs/prismadb'
import { pusherServer } from '@/app/libs/pusher';
import { NextResponse } from 'next/server';

interface IParams {
    conversationId?: string
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const { conversationId } = params;
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', {
                status: 400
            })
        }
        if (!conversationId) {
            return new NextResponse('Invalid parameters', {
                status: 402
            });
        }

        const conversation = await prismadb.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });
        if (!conversation) {
            return new NextResponse('Invalid parameters', {
                status: 402
            });
        }

        const deletedConversation = await prismadb.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        });

        conversation.users.forEach(user => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:remove', conversation);
            }
        })

        return NextResponse.json(deletedConversation);
    } catch (e) {
        console.log('Error in conversation delete', e)
        return new NextResponse('Something went wrong', {
            status: 500
        })
    }
}