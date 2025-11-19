'use client';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import React, { useActionState, useEffect, useMemo, useRef, useState } from 'react';
import { createArticle } from '../../../actions/action';
import { Loader2, FileText, Image as ImageIcon, Tag } from 'lucide-react';
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

  const editorConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Start writing your article...',
    height: 500,
    toolbar: true,
    spellcheck: true,
    language: 'en',
    toolbarButtonSize: 'medium' as const,
    toolbarAdaptive: false,
    theme: 'default',
    editorBackground: 'transparent',
    defaultMode: '1', // WYSIWYG mode
  }), [])

  useEffect(() => {
    if (formdata.success) {
      toast.success("Article published successfully!");
      router.push("/articles");
    }
  }, [formdata.success, router]);

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <FileText className="h-4 w-4" />
            Create Article
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Write Your Story
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Share your thoughts, ideas, and insights with the community
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border shadow-xl p-6 sm:p-8 space-y-6">
          <form action={action} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Article Title
              </Label>
              <Input
                type="text"
                name="title"
                id="title"
                placeholder="Enter a compelling title..."
                className="h-12 text-base"
              />
              {formdata.errors.title && formdata?.errors?.title[0] && (
                <span className='text-destructive text-sm flex items-center gap-1'>
                  {formdata.errors.title[0]}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-base font-semibold">
                Content
              </Label>
              <Input type='hidden' name='content' value={content} />
              <div className="border border-border rounded-lg overflow-hidden jodit-editor-wrapper">
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={editorConfig}
                  onBlur={(newContent) => setContent(newContent)}
                  onChange={(newContent) => setContent(newContent)}
                />
              </div>
              {formdata.errors.content && formdata?.errors?.content[0] && (
                <span className='text-destructive text-sm flex items-center gap-1'>
                  {formdata.errors.content[0]}
                </span>
              )}
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
                placeholder="e.g., Technology, Design, Tutorial..."
                className="h-12 text-base"
              />
              {formdata.errors.category && formdata?.errors?.category[0] && (
                <span className='text-destructive text-sm flex items-center gap-1'>
                  {formdata.errors.category[0]}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="file" className="text-base font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Cover Image
              </Label>
              <Input
                type="file"
                name="file"
                id="file"
                accept='image/*'
                className="h-12 cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                Upload a cover image for your article (optional but recommended)
              </p>
              {formdata.errors.imageurl && formdata?.errors?.imageurl[0] && (
                <span className='text-destructive text-sm flex items-center gap-1'>
                  {formdata.errors.imageurl[0]}
                </span>
              )}
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
                    Publishing...
                  </>
                ) : (
                  "Publish Article"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
