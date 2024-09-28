'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search } from 'lucide-react'

// mock
const blogPosts = [
  { id: 1, title: "我的第一篇博客", createAt: "2023-09-27", content: "这是我的第一篇博客文章...", author: 'yangqi' },
  { id: 2, title: "学习React的心得", createAt: "2023-09-28", content: "React真是一个强大的前端框架...", author: 'yangqi' },
  { id: 3, title: "旅行日记：巴黎", createAt: "2023-09-29", content: "巴黎是一座充满魅力的城市...", author: 'yangqi' },
]

export function Page() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">yangqi</h1>
            {/* <nav>
              <Button variant="ghost" asChild>
                <Link href="/">首页</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/about">关于我</Link>
              </Button>
            </nav> */}
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="搜索文章..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((blog) => (
              <Link href={`/blog/${blog.id}`} key={blog.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{blog.title}</CardTitle>
                    <CardDescription>{blog.createAt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {blog.content}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <p className="text-center text-gray-500 mt-6">没有找到匹配的文章</p>
          )}
        </div>
      </main>
    </div>
  )
}