'use client'

import { useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

import {
  CheckCircleIcon,
  CircleArrowDown,
  CircleArrowDownIcon,
  HammerIcon,
  RocketIcon,
  SaveIcon
} from 'lucide-react'
import useUpload, { StatusText } from '@/hooks/useUpload'
import { useRouter } from 'next/navigation'

const FileUploader = () => {

  const { progress, status, fileId, handleUpload } = useUpload();

  const router = useRouter();

  useEffect(() => {
    if(fileId){
      router.push(`/dashboard/files/${fileId}`)
    }
  }, [fileId, router])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files

    const file = acceptedFiles[0]

    if (file) {
      await handleUpload(file);
    } else {
    }
  }, []);

  const statusIcons: {
    [key in StatusText]: JSX.Element;
  } = {
    [StatusText.UPLOADING]: (
      <RocketIcon className="h-16 w-16 text-indigo-600" />
    ),
    [StatusText.UPLOADED]: (
      <CheckCircleIcon className="h-16 w-16 text-indigo-600" />
    ),
    [StatusText.SAVING]: (
      <SaveIcon className="h-16 w-16 text-indigo-600" />
    ),
    [StatusText.GENERATING]: (
      <HammerIcon className="h-16 w-16 text-indigo-600 animate-bounce" />
    ),
  }

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        'application/pdf': ['.pdf']
      }
    })

    const uploadInProgress = progress != null && progress >= 0 && progress <= 100;

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      {/* Loading... */}

      <div className="mt-32 flex flex-col gap-4 items-center max-w-7xl mx-auto">
        {uploadInProgress ? (
          <div 
            className={`radial-progress bg-indigo-300 text-white border-indigo-600 border-4 ${progress === 100 && "hidden"}`}
            role="progressbar"
            style={{
              // @ts-ignore
              "--value": progress,
              "--size": "12em",
              "--thickness": "1.3rem",
            }}
          >
            {progress} %
          </div>

          // Render Status Icon

        ) : (
          <div>

            {/* Render Status Icon */}
            {
              // @ts-ignore
              statusIcons[status!]
            }

            <p className="text-indigo-600 animate-pulse">
              {/* @ts-ignore */}
              {status}
            </p>
          </div>
        )}
        </div>
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed mt-10 w-[90%] mx-auto border-indigo-600 text-indigo-600 rounded-lg h-96 flex items-center justify-center ${
          isFocused || isDragAccept ? 'bg-indigo-300' : 'bg-white'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          {isDragActive ? (
            <>
              <RocketIcon className="h-12 w-12 animate-ping mb-6" />
              <p>Drop the files here ...</p>
            </>
          ) : (
            <>
              <CircleArrowDownIcon className="h-12 w-12 animate-bounce mb-2" />
              <p>
                Drag &apos;n&apos; drop some files here, or click to select
                files
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUploader
