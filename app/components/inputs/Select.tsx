"use client"
import React from 'react'
import { FieldErrors } from 'react-hook-form';
import ReactSelect from 'react-select'

interface SelectProps {
    disabled?: boolean;
    value?: Record<string, any>;
    onChange: (value: Record<string, any>) => void;
    label: string;
    errors: FieldErrors;
    options: Record<string, any>[];
}

export default function Select({
    disabled,
    value,
    onChange,
    label,
    errors,
    options
}: SelectProps) {
    return (
        <div className='z-[100]'>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
                {label}
            </label>
            <div
                className='mt-2'
            >
                <ReactSelect
                    isDisabled={disabled}
                    value={value}
                    onChange={onChange}
                    isMulti={true}
                    options={options}
                    menuPortalTarget={document.body}
                    styles={{
                        menuPortal: (base) => {
                            return {
                                ...base,
                                zIndex: 9999
                            }
                        }
                    }}
                    classNames={{
                        control: () => "text-sm"
                    }
                    }
                />
            </div>
        </div>
    )
}
