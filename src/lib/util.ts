import { differenceInYears, format, formatDistance } from "date-fns"
import { FieldValues, Path, UseFormSetError } from "react-hook-form"
import { ZodIssue } from "zod"

export const calculateAge = (dob: Date) => {
    return differenceInYears(new Date(), dob)
}

export const formatShortDateTime = (date: Date) => 
  format(date, 'dd MMM yy h:mm:a')

export const timeAgo = (date: string) => {
  return formatDistance(new Date(date), new Date()) + ' ago'
}

export function handleFormServerErrors<TFieldValues extends FieldValues>(
    errorResponse: {error: string | ZodIssue[]},
    setError: UseFormSetError<TFieldValues>)  
    {
        if (Array.isArray(errorResponse.error)) {
          errorResponse.error.forEach((e) => {
            const fieldName = e.path.join('.') as Path<TFieldValues>
            setError(fieldName, { message: e.message })
          })
        } else {
          setError('root.serverError', { message: errorResponse.error })
        }
    }

export const transformImageUrl = (imageUrl: string | null | undefined) => {
  if(!imageUrl) return null
  if(!imageUrl.includes('cloudinary')) return imageUrl;

  const uploadIndex = imageUrl.indexOf('/upload/') + '/upload/'.length

  const transformation = 'c_fill,w_300,h_300,g_faces/'

  return `${imageUrl.slice(0, uploadIndex)}${transformation}${imageUrl.slice(uploadIndex)}`
}

export const truncateString = (text?: string | null, num = 50) => {
  if(!text) return null
  if(text.length <= num) return text
  
  return text.slice(0,num) + '...'
}

export const createChatId = (a: string, b: string) => {
  return a > b ? `${b}-${a}` : `${a}-${b}`
}