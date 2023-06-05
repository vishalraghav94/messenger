import prisma from '@/app/libs/prismadb'
import getCurrentUser from './getCurrentUser'

const getConversationById = async (conversationId: string) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.email) {
            return null
        }
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true,
                        sender: true
                    }
                }
            }
        })

        if (!conversation) {
            return null
        }

        return conversation;
    } catch (e) {
        return null;
    }
}

export default getConversationById