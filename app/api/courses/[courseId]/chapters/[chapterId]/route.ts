import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET
});

console.log(process.env.MUX_TOKEN_ID)

export async function DELETE(   
    req: Request,
    {params} : {params: { courseId: string, chapterId: string}}
) {
    try {
        const {userId} = auth();

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if(!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401})
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        });

        if (!chapter) {
            return new NextResponse("Unauthorized", { status: 401})
        }

        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            })

            if (existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId)
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        })

        // if a course has another chapter published we want this to stay published
        // we require a course to have one chapter published to stay published

        const publishedChapterInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        });

        if (!publishedChapterInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(deletedChapter)

    } catch (error) {
        console.log("[COURSE_CHAPTERID", error);
        return new NextResponse('Internal Error', {status: 500})
    }
}

export async function PATCH(
    req: Request,
    {params} : {params: { courseId: string, chapterId: string}}
) {
    try {
        const {userId} = auth()
        const {isPublished, ...values} = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if(!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401})
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            /* values look like this { title : string} or {} */
            data: {
                ...values
            }
        })
        console.log(values)

        //handle Mux data video url
        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

        if (existingMuxData) {
            await mux.video.assets.delete(existingMuxData.assetId)
            await db.muxData.delete({
                where: {
                    id: existingMuxData.id
                }
            })
            console.log('succeed')
        }

            
        const asset = await mux.video.assets.create({
            input: [{url: values.videoUrl}],
            playback_policy: ['public'],
            test: false
        })

        console.log(asset)

        await db.muxData.create({
            data:{
                chapterId: params.chapterId,
                assetId: asset.id,
                playbackId: asset.playback_ids?.[0]?.id,
            }
        })
        }


        return NextResponse.json(chapter)
    } catch (error) {
        console.log("[COURSE_CHAPTERID", error);
        return new NextResponse('Internal Error', {status: 500})
    }
}