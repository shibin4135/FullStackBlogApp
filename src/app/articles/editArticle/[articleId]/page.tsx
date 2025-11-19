"use client"
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Image as ImageIcon, Tag, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const JoditEditor = dynamic(() => import('jodit-react'), {
    ssr: false
})

const EditArticle = () => {
    const { articleId } = useParams()
    const router = useRouter()
    const editor = useRef(null)
    const [content, setContent] = useState<string>("")
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [isPending, setIsPending] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [imageFile, setImageFile] = useState<File | null>(null)

    useEffect(() => {
        const getSingleArticle = async () => {
            try {
                setIsLoading(true)
                const response = await fetch(`/api/get-single-article/${articleId}`)
                const result = await response.json()
                if (result.article) {
                    setTitle(result.article.title)
                    setContent(result.article.content)
                    setCategory(result.article.category || "")
                }
            } catch (error) {
                console.log('Something went wrong', error)
                toast.error("Failed to load article")
            } finally {
                setIsLoading(false)
            }
        }
        getSingleArticle()
    }, [articleId])

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImageFile(file as File)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) {
            toast.error("Title and content are required")
            return
        }

        const formdata = new FormData();
        formdata.append("title", title)
        formdata.append("content", content)
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
            if (response.ok) {
                toast.success("Article updated successfully!")
                router.push(`/articles/${articleId}`)
            } else {
                toast.error("Failed to update article")
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsPending(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                        <FileText className="h-4 w-4" />
                        Edit Article
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Update Your Article
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Make changes to your article and save your updates
                    </p>
                </div>

                <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border shadow-xl p-6 sm:p-8 space-y-6">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Article Title
                            </Label>
                            <Input
                                type="text"
                                name="title"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a compelling title..."
                                className="h-12 text-base"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content" className="text-base font-semibold">
                                Content
                            </Label>
                            <Input type='hidden' name='content' value={content} />
                            <div className="border border-border rounded-lg overflow-hidden">
                                <JoditEditor
                                    ref={editor}
                                    value={content}
                                    tabIndex={1}
                                    onBlur={(newContent) => setContent(newContent)}
                                    onChange={(newContent) => setContent(newContent)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-base font-semibold flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                Category
                            </Label>
                            <Input
                                type="text"
                                name="category"
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g., Technology, Design, Tutorial..."
                                className="h-12 text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="file" className="text-base font-semibold flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" />
                                Update Cover Image
                            </Label>
                            <Input
                                type="file"
                                name="file"
                                id="file"
                                accept='image/*'
                                className="h-12 cursor-pointer"
                                onChange={handleImage}
                            />
                            <p className="text-sm text-muted-foreground">
                                Leave empty to keep the current cover image
                            </p>
                        </div>

                        <div className="pt-4 flex justify-end gap-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => router.back()}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="px-8 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className='animate-spin mr-2 h-4 w-4' />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Update Article
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditArticle