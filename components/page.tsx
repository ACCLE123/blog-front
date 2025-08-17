'use client'

import { useEffect, useState } from 'react'
import { Card, easing } from "@/components/ui/card"
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
    <div className="min-h-screen bg-black">
      <header className="bg-black/50 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto py-8 px-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            {!isAuthenticated ? (
              <div className="relative">
                <Input
                  type="text"
                  placeholder="输入 Token..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onKeyDown={handleTokenKeyPress}
                  className="w-full sm:w-72 pl-4 pr-12 py-3 bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 rounded-lg backdrop-blur-sm transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => router.push('/create-post')}
                className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                发布帖子
              </Button>
            )}
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="搜索文章..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 rounded-lg backdrop-blur-sm transition-all duration-300"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-6">
        <div style={{ gap: '80px' }} className="flex flex-col">
          {filteredPosts.map((blog, index) => (
            <Link href={`/blog/${blog.ID}`} key={blog.ID}>
              <Card 
                className="w-full bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 hover:bg-gray-900/50 hover:border-cyan-500/30 transition-all duration-500 group cursor-pointer relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: easing,
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: easing }
                }}
              >
                {/* 科技感装饰线 */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="p-10 relative">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 mb-4 tracking-tight">
                        {blog.Title}
                      </h2>
                      <div className="flex items-center text-sm text-gray-500 mb-6">
                        <div className="w-4 h-4 mr-3 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        {new Date(blog.CreatedAt).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="ml-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                                     <div className="prose prose-invert max-w-none">
                     <div className="text-gray-400 leading-relaxed text-base max-h-[300px] overflow-hidden">
                      <ReactMarkdown 
                        rehypePlugins={[]}
                        components={{
                          pre: ({ children }) => (
                            <pre className="max-h-[60px] overflow-hidden text-xs bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                              {children}
                            </pre>
                          ),
                          code: ({ children }) => (
                            <code className="bg-gray-800/50 px-2 py-1 rounded-md text-xs border border-gray-700/50">
                              {children}
                            </code>
                          )
                        }}
                      >
                        {blog.Content.replace(/\\n/g, '\n')}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 text-gray-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">没有找到匹配的文章</p>
            <p className="text-gray-600 text-sm">尝试调整搜索关键词</p>
          </div>
        )}
      </main>
    </div>
  )
}