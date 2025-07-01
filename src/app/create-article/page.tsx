'use client';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import React, { useActionState, useEffect, useRef, useState } from 'react';
import { createArticle } from '../../../actions/action';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false
})

const CreateArticle = () => {
  const [content, setContent] = useState<string>('');
  const editor = useRef(null);
  const router = useRouter()

  const initialState = {
    success: false,
    errors: {
      title: [""],
      content: [""],
      category: [""]
    }
  }

  const [formdata, action, isPending] = useActionState(createArticle, initialState)

  useEffect(() => {
    if (formdata.success) {
      toast.success("Post created successfully");
      router.push("/articles");
    }
  }, [formdata.success, router]);

  return (
    <div className="min-h-screen py-10 px-4 flex justify-center bg-gray-50 dark:bg-zinc-900">
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white"> Create a New Article</h1>

        <form action={action} className="space-y-5">

          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </Label>
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="Enter the article title"
              className="dark:bg-zinc-700 dark:text-white"
            />
            <span className='text-red-500 mt-2 '>{formdata.errors.title && formdata?.errors?.title[0]}</span>
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
            <span className='text-red-500 mt-2 '>{formdata.errors.content && formdata?.errors?.content[0]}</span>
          </div>


          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </Label>
            <Input
              type="text"
              name="category"
              id="category"
              placeholder="Enter the article Category"
              className="dark:bg-zinc-700 dark:text-white"
            />
            <span className='text-red-500 mt-2 '>{formdata.errors.category && formdata?.errors?.category[0]}</span>
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
            />
            <span className='text-red-500 mt-2 '> {formdata.errors.imageurl && formdata?.errors?.imageurl[0]}</span>
          </div>


          <div className="pt-4 flex justify-end">
            <Button type="submit" className="px-6 py-2 text-md font-medium">
              {isPending ? <Loader2 className='animate-spin ' /> : "Publish Article"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;
