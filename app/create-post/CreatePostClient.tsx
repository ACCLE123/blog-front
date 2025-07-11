'use client'

import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter, useSearchParams } from "next/navigation"
import { Blog, fetchBlogByID, updateOrAddBlog, uploadImageToOSS } from '@/api/blog'
import ReactMarkdown from 'react-markdown'

export default function CreatePostClient() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const searchParams = useSearchParams(); 

  const blogId = Number(searchParams.get('blogId'));

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetchBlogByID(blogId);
        setTitle(response.Title)
        setContent(response.Content)
      } catch (error) {
        console.error(error);
        alert('Failed to get blog!');
      }
    };

    if (blogId !== 0) {
      fetchBlog();
    }
  }, [blogId])

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert('标题和内容不能为空！')
      return
    }
    
    const blog: Blog = {
      ID: blogId,
      Title: title,
      Content: content,
      CreatedAt: new Date().toISOString(),
      Category: 'Tech',
      Tags: 'JavaScript, Programming',
      ViewCount: 100,
      Author: 'Liam',
    };
  
    setIsLoading(true)
    try {
      await updateOrAddBlog(blog);
      alert('Blog updated or added successfully!');
      router.push('/')
    } catch (error) {
      console.error(error);
      alert('Failed to update or add blog!');
    } finally {
      setIsLoading(false)
    }
  }

  // 粘贴图片上传并插入 markdown
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          try {
            const url = await uploadImageToOSS(file);
            const markdown = `![image](${url})`;
            insertAtCursor(markdown);
          } catch (err) {
            alert('图片上传失败');
          }
          e.preventDefault();
          break;
        }
      }
    }
  };

  // 在光标处插入文本
  const insertAtCursor = (text: string) => {
    const textarea = document.activeElement as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);
    setContent(before + text + after);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 ">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-md p-6 space-y-8">
        <Input
          type="text"
          placeholder="输入标题..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
        <Textarea
          placeholder="输入内容..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onPaste={handlePaste}
          className="w-full h-96 border rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-8">
          <div className="prose p-4 rounded min-h-[100px]">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
        <Button onClick={handlePublish} disabled={isLoading} className="w-full">
          {isLoading ? '发布中...' : '发布'}
        </Button>
      </div>
    </div>
  )
}