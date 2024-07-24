'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import { 
  CheckCircleIcon,
  CircleArrowDown,
  CircleArrowDownIcon,
  HammerIcon,
  RocketIcon,
  SaveIcon,
} from 'lucide-react';

const FileUploader = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
  }, [])

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } = useDropzone({
    onDrop
  })

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">

      {/* Loading... */}
      <div {...getRootProps()}
      className={`p-10 border-2 border-dashed mt-10 w-[90%] mx-auto border-indigo-600 text-indigo-600 rounded-lg h-96 flex items-center justify-center ${ isFocused || isDragAccept ? 'bg-indigo-300' : 'bg-white' }`}
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
            <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
          </>
        )}
      </div>
    </div>
    </div>
  )
}

export default FileUploader