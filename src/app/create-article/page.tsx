'use client';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import React, { useActionState, useEffect, useMemo, useRef, useState } from 'react';
import { createArticle } from '../../../actions/action';
import { Loader2, FileText, Image as ImageIcon, Tag, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false
})

const CreateArticle = () => {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
      // Clear form on success
      setContent('');
      setTitle('');
      setCategory('');
      setTags([]);
      setTagInput('');
      setIsDraft(false);
      setImageFile(null);
      router.push("/articles");
    } else if (formdata.errors && Object.keys(formdata.errors).length > 0) {
      // Show error toast if there are validation errors
      const firstError = Object.values(formdata.errors).find(err => err && err[0]);
      if (firstError && firstError[0]) {
        toast.error(firstError[0]);
      }
    }
  }, [formdata.success, formdata.errors, router]);

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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
              <Label htmlFor="tags" className="text-base font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((_, i) => i !== index))}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      e.preventDefault();
                      if (!tags.includes(tagInput.trim()) && tags.length < 10) {
                        setTags([...tags, tagInput.trim()]);
                        setTagInput('');
                      }
                    }
                  }}
                  placeholder="Add tags (press Enter)..."
                  className="h-12 text-base"
                />
                <Input type="hidden" name="tags" value={JSON.stringify(tags)} />
              </div>
              <p className="text-sm text-muted-foreground">
                Add up to 10 tags to help readers discover your article
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isDraft"
                  checked={isDraft}
                  onChange={(e) => setIsDraft(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <Label htmlFor="isDraft" className="text-base font-semibold cursor-pointer">
                  Save as draft
                </Label>
              </div>
              <Input type="hidden" name="isDraft" value={isDraft.toString()} />
              <p className="text-sm text-muted-foreground">
                Draft articles won't be visible to other users until published
              </p>
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
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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
