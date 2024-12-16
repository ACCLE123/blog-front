'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import axios from 'axios'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert('标题和内容不能为空！')
      return
    }

    setIsLoading(true)
    try {
      await axios.post('http://47.93.28.209:8080/blogs', {
        Title: title,
        Content: content,
        Category: 'General',
        Tags: 'Default',
        Author: 'Liam',
      })
      alert('发布成功！')
      router.push('/')
    } catch (error) {
      console.error('发布失败：', error)
      alert('发布失败，请稍后重试！')
    } finally {
      setIsLoading(false)
    }
  }

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
          className="w-full h-96 border rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={handlePublish} disabled={isLoading} className="w-full">
          {isLoading ? '发布中...' : '发布'}
        </Button>
      </div>
    </div>
  )
}