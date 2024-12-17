'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, easing } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { fetchBlogs, Blog } from '@/api/blog'
import ReactMarkdown from 'react-markdown'
import Cookies from 'js-cookie' // 引入 Cookies 库

export function Page() {
  const [searchTerm, setSearchTerm] = useState('')
  const [blogPosts, setBlogPosts] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 读取 Cookie 中的 Token
    const storedToken = Cookies.get('auth_token')
    if (storedToken) {
      // 如果存在 Token，则进行验证
      validateToken(storedToken)
    }

    const getBlogs = async () => {
      try {
        const blogs = await fetchBlogs()
        setBlogPosts(blogs)
      } catch (error) {
        console.error("Failed to fetch blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    getBlogs()
  }, [])

  const validateToken = (token: string) => {
    // 模拟 Token 验证逻辑（实际情况需要请求后端验证）
    if (token === '20021221') {
      setIsAuthenticated(true)
      setToken(token)
    } else {
      Cookies.remove('auth_token')
    }
  }

  const handleTokenKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && token) {
      // 模拟 Token 验证逻辑
      if (token === '20021221') {
        setIsAuthenticated(true)
        Cookies.set('auth_token', token, { expires: 30 })
      } else {
        alert('无效的 Token')
      }
    }
  }

  const filteredPosts = blogPosts.filter(post =>
    post.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.Content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="text-center">加载中...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            {!isAuthenticated ? (
              <Input
                type="text"
                placeholder="输入 Token..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyPress={handleTokenKeyPress}
                className="w-full sm:w-1/4 pl-5"
              />
            ) : (
              <Button
                onClick={() => router.push('/create-post')}
                className="w-full sm:w-auto"
              >
                发布帖子
              </Button>
            )}
            <Input
              type="text"
              placeholder="搜索文章..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-5"
            />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((blog) => (
              <Link href={`/blog/${blog.ID}`} key={blog.ID}>
                <Card className="min-h-[400px] max-h-[400px]" initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.6, 
                    ease: easing, 
                  }}
                  whileFocus={{ scale: 1.02, transition: { duration: 0.3, ease: easing } }}
                  whileHover={{ scale: 1.01, transition: { duration: 0.2, ease: easing } }}
                  >
                  <CardHeader>
                    <CardTitle>{blog.Title}</CardTitle>
                    <CardDescription>{new Date(blog.CreatedAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <div className="overflow-hidden">
                    <CardContent className="line-clamp-5 prose overflow-hidden max-h-[200px]">
                      <ReactMarkdown rehypePlugins={[]}>
                        {blog.Content.replace(/\\n/g, '\n')}
                      </ReactMarkdown>
                    </CardContent>
                  </div>
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