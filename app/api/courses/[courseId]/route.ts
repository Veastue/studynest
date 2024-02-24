import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node"

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!
})

export async function DELETE(
    req : Request,
    {params} : {params: {courseId: string}}

) {
    try {
        const {userId} = auth();

        if(!userId) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });

        if(!course) {
            return new NextResponse('Not found', {status: 404})
        }

        // handle MUX.COM assets deletion per chapter
        for (const chapter of course.chapters) {
            if(chapter.muxData?.assetId) {
                await mux.video.assets.delete(
                    chapter.muxData.assetId
                )
            }
        }

        //handle deletion of course in our database

        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId,
            }
        })

        return NextResponse.json(deletedCourse);
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Server Error', {status: 500})
    
    }
}

export async function PATCH(
    req: Request,
    {params} : {params: {courseId: string}}
) {
    try {
        const {userId} = auth();
        const {courseId} = params;
        const values = await req.json();
        if(!userId){
            return new NextResponse('Unauthorized', { status: 401})
        }

        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(course);
    } catch (error){
        console.log(error);
        return new NextResponse('Internal Server Error', {status: 500})
    }
}