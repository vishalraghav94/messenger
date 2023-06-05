'use client'
import React from 'react'
import Modal from './Modal';
import Image from 'next/image'
import { Message } from '@prisma/client';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: Message
}

export default function ImageModal({
    isOpen,
    onClose,
    message
}: ImageModalProps) {
    if (!message.image) {
        return null;
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div
                className='
                    w-80
                    h-80
                '
            >
                <Image
                    alt="sent image"
                    className='
                    object-contain
                    '
                    fill
                    src={message.image || '/images/placeholder.png'}
                />
            </div>
        </Modal>
    )
}
