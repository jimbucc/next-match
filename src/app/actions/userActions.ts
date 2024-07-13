'use server'

import { memberEditSchema, MemberEditSchema } from "@/lib/schemas/memberEditSchema"
import { ActionResult } from "@/types"
import { Member, Photo } from "@prisma/client"
import { getAuthUserId } from "./authActions"
import { prisma } from "@/lib/prisma"
import { cloudinary } from "@/lib/cloudinary"

export const updateMemberProfile = async (data: MemberEditSchema, nameUpdated: boolean): Promise<ActionResult<Member>> => {
    try {
        const userId = await getAuthUserId()
        const validated = memberEditSchema.safeParse(data)
        if(!validated.success) return {status: 'error', error: validated.error.errors}

        const {name, description, city, country } = validated.data

        if(nameUpdated) {
            await prisma.user.update({
                where: {id: userId},
                data: {name}
            })
        }

        const member = await prisma.member.update({
            where: {userId},
            data: {
                name,
                description,
                city,
                country
            }
        })

        return {status: 'success', data: member}

    } catch (error) {
        console.log(error)
        return { status: 'error', error: 'Something went wrong' }
    }
}

export const addImage = async (url: string, publicId: string) => {
    try {
        const userId = await getAuthUserId()

        return prisma.member.update({
            where: {userId},
            data: {
                photos: {
                    create: [
                        {
                            url,
                            publicId
                        }
                    ]
                }
            }
        })
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const setMainImage = async (photo: Photo) => {
    try {
        const userId = await getAuthUserId()
        
        await prisma.user.update({
            where: {id: userId},
            data: {image: photo.url}
        })

        return prisma.member.update({
            where: {userId},
            data: {
                image: photo.url
            }
        })
        
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const deletImage = async (photo: Photo) => {
    try {
        const userId = await getAuthUserId()
        if(photo.publicId) {
            await cloudinary.v2.uploader.destroy(photo.publicId)
        }     
        return prisma.member.update({
            where: {userId},
            data: {
                photos: {
                    delete: {id: photo.id}
                }
            }
        })
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const getUserInfoForNav = async () => {
    try {
        const userId = await getAuthUserId()
        return prisma.user.findUnique({
            where: {id: userId},
            select: {name: true, image: true}
        })
    } catch (error) {
        console.log(error)
        throw error
        
    }
}