"use client"

import { User } from 'next-auth';
import React, { useState } from 'react'
import Modal from '../Modal';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '../inputs/Input';
import { CldUploadButton } from 'next-cloudinary';
import Button from '../Button';
import Image from 'next/image'

interface SettingsModalProps {
    currentUser: User | null;
    isOpen?: boolean;
    onClose: () => void;
}

export default function SettingsModal({
    isOpen,
    currentUser,
    onClose
}: SettingsModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.image
        }
    });

    const image = watch('image')

    const handleUpload = (result: any) => {
        setValue('image', result?.info?.secure_url, {
            shouldValidate: true
        })
    }

    const submitHandler: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)

        axios.post('/api/settings', data).then(() => {
            router.refresh();
            onClose()
        }).catch(() => {
            toast.error('Something went wrong')
        }).finally(() => {
            setIsLoading(false)
        })
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(submitHandler)}>
                <div className='space-y-12'>
                    <div
                        className='border-b border-gray-900/10 pb-12'
                    >
                        <h2
                            className='
                            text-base
                            font-semibold
                            leading-7
                            text-gray-900
                        '
                        >
                            Profile
                        </h2>
                        <p
                            className='mt-1 text-sm leading-6 text-gray-600'
                        >
                            Edit your public information
                        </p>
                        <div
                            className='
                        mt-10
                        flex
                        flex-col
                        gap-y-8
                        '
                        >
                            <Input id="name" label="Name" register={register} errors={errors} type="text" disabled={isLoading} />
                            <div>
                                <label
                                    className='
                                block
                                text-sm
                                font-medium
                                leading-6
                                text-gray-900
                                '
                                >
                                    Photo
                                </label>
                                <div
                                    className='
                                mt-2
                                flex
                                items-center
                                justify-center
                                gap-x-3
                                '
                                >
                                    <CldUploadButton
                                        options={{
                                            maxFiles: 1
                                        }}
                                        onUpload={handleUpload}
                                        uploadPreset='cglhgz29'
                                    >
                                        <Image
                                            width="100"
                                            height="100"
                                            className='rounded-full aspect-square hover:opacity-50'
                                            src={image || currentUser?.image || '/images/placeholder.png'}
                                            alt="avatar"
                                        />
                                    </CldUploadButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className='
                    flex
                    mt-6
                    items-center
                    justify-end
                    '
                    >
                        <Button type="button" disabled={isLoading} secondary onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    )
}
