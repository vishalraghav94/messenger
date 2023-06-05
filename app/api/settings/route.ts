import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const currentUser = await getCurrentUser();

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', {
                status: 402
            })
        }

        const user = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                name: body.name,
                image: body.image
            }
        });
        return NextResponse.json(user);
    } catch (e) {
        console.log('Error occured in settings', e)
        return new NextResponse('Internal server error', {
            status: 500
        })
    }
}