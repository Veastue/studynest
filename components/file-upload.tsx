"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { useToast } from "./ui/use-toast";

interface FileUploadProps {
    onChange: (url?:string) => void
    endpoint: keyof typeof ourFileRouter;
}

const FileUpload = ({
    onChange,
    endpoint
}:FileUploadProps) => {
    const {toast} = useToast()
  return (
    <UploadDropzone 
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
            onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
            toast({
                title: 'Something is wrong',
                description: error?.message
            })
        }}
    />
  )
}

export default FileUpload