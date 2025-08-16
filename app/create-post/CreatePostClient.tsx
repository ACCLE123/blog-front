'use client'

import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
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
          } catch (error) {
            console.error(error);
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
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto py-12 px-6">
        <Card className="w-full bg-gray-900/30 backdrop-blur-sm border border-gray-800/50">
          <div className="p-10 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-6 tracking-tight">
                {blogId !== 0 ? '编辑帖子' : '发布新帖子'}
              </h1>
              <Input
                type="text"
                placeholder="输入标题..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 rounded-lg backdrop-blur-sm transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">内容</label>
              <Textarea
                placeholder="输入内容，支持 Markdown 格式..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onPaste={handlePaste}
                className="w-full h-96 pl-4 pr-4 py-3 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 rounded-lg backdrop-blur-sm transition-all duration-300 resize-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">预览</label>
              <div className="prose prose-invert max-w-none bg-gray-800/30 p-6 rounded-lg border border-gray-700/50 min-h-[200px]">
                <ReactMarkdown 
                  rehypePlugins={[]}
                  components={{
                    pre: ({ children }) => (
                      <pre className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50 overflow-x-auto text-sm">
                        {children}
                      </pre>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-700/50 px-2 py-1 rounded-md text-sm border border-gray-600/50">
                        {children}
                      </code>
                    )
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button 
                onClick={() => router.push('/')} 
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
              >
                取消
              </Button>
              <Button 
                onClick={handlePublish} 
                disabled={isLoading} 
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
              >
                {isLoading ? '发布中...' : (blogId !== 0 ? '更新' : '发布')}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}