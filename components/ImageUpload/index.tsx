"use client"

// top level imports
import { ReactElement, useEffect, useState } from "react";
import Image from "next/image";

import { CldUploadButton } from "next-cloudinary";

// type definition
interface IProps {
    value: string;
    onChange: (src: string) => void;
    disabled?: boolean
}

// component definition
export function ImageUpload({
    value,
    onChange,
    disabled = false
}: IProps): ReactElement | null {
    // state definition
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => setIsMounted(true), []);

    if (!isMounted) return null;
    
    return (
        <div className="space-y-4 w-full flex flex-col justify-center items-center">
            <CldUploadButton
                onUpload={(result: any) => onChange(result.info.secure_url)}
                options={{ maxFiles: 1 }}
                uploadPreset="cglecy15"
            >
                <div
                    className="
                        p-4 
                        border-4 
                        border-dashed
                        border-primary/10 
                        rounded-lg 
                        hover:opacity-75 
                        transition 
                        flex 
                        flex-col 
                        space-y-2 
                        items-center 
                        justify-center
                    "
                >
                    <div className="relative h-40 w-40">
                        <Image
                            fill
                            alt="Upload"
                            src={value || "/placeholder.svg"}
                            className="rounded-lg object-cover"
                        />
                    </div>
                </div>
            </CldUploadButton>
        </div>
    )
}