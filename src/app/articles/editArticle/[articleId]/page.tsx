"use client"
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const JoditEditor = dynamic(() => import('jodit-react'), {
    ssr: false
})

const EditArticle = () => {
    const { articleId } = useParams()
    console.log(articleId)
    const editor = useRef(null)
    const [content, setContent] = useState<string>("")
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [isPending, setIsPending] = useState<boolean>(false)
    const [imageFile, setImageFile] = useState<File | null>(null)

    useEffect(() => {
        const getSingleArticle = async () => {
            try {
                const response = await fetch(`/api/get-single-article/${articleId}`)
                const result = await response.json()
                setTitle(result.article.title)
                setContent(result.article.content)
                setCategory(result.article.category)
            } catch (error) {
                console.log('Something went wrong', error)
            }
        }
        getSingleArticle()
    }, [])


    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImageFile(file as File)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formdata = new FormData();
        formdata.append("title", title)
        formdata.append("content",content)
        formdata.append("category", category)
        if (imageFile) {
            formdata.append("file", imageFile)
        }
        formdata.append("articleId", articleId as string);
        try {
            setIsPending(true)
            const response = await fetch('/api/edit-article', {
                method: "POST",
                body: formdata
            });
            const result = await response.json();
            console.log(result)
        } catch (error) {
            console.log('Something Went Wrong')
        }finally{
            setIsPending(false)
        }
    }

    return (
        <div className="min-h-screen py-10 px-4 flex justify-center bg-gray-50 dark:bg-zinc-900">
            <div className="w-full max-w-4xl bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 space-y-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white"> Edit Article</h1>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Title
                        </Label>
                        <Input
                            type="text"
                            name="title"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter the article title"
                            className="dark:bg-zinc-700 dark:text-white"
                        />
                        <span className='text-red-500 mt-2 '></span>
                    </div>


                    <div className="flex flex-col gap-2">
                        <Label htmlFor="content" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Content
                        </Label>
                        <Input type='hidden' name='content' value={content} />
                        <JoditEditor
                            ref={editor}
                            value={content}
                            tabIndex={1}
                            onBlur={(newContent) => setContent(newContent)}
                            onChange={(newContent) => setContent(newContent)}
                        />
                        <span className='text-red-500 mt-2 '></span>
                    </div>


                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Category
                        </Label>
                        <Input
                            type="text"
                            name="category"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Enter the article Category"
                            className="dark:bg-zinc-700 dark:text-white"
                        />
                        <span className='text-red-500 mt-2 '></span>
                    </div>


                    <div className="flex flex-col gap-2">
                        <Label htmlFor="slug" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Upload a image
                        </Label>
                        <Input
                            type="file"
                            name="file"
                            id="file"
                            accept='image/*'
                            className="dark:bg-zinc-700 dark:text-white"
                            onChange={handleImage}
                        />
                        <span className='text-red-500 mt-2 '> </span>
                    </div>


                    <div className="pt-4 flex justify-end">
                        <Button type="submit" className="px-6 py-2 text-md font-medium" disabled={isPending}>
                            {isPending ? <Loader2 className='animate-spin ' /> : "Update Article"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditArticle