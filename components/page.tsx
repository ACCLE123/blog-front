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
import { ThemeToggle } from '@/components/theme-toggle'

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

  // 辅助函数：提取纯文本预览
  const getPreviewText = (markdown: string) => {
    return markdown
      .replace(/[#*`_~[\]()]/g, '') // 移除大部分 Markdown 符号
      .replace(/\\n/g, ' ')
      .substring(0, 160) + '...';
  }

  if (loading) {
    return <div className="text-center">加载中...</div>
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto py-6 px-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 items-center">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mr-4">Liam's Blog</h1>
              <div className="sm:hidden">
                <ThemeToggle />
              </div>
            </div>
            {!isAuthenticated ? (
              <div className="relative">
                <Input
                  type="text"
                  placeholder="输入 Token..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onKeyDown={handleTokenKeyPress}
                  className="w-full sm:w-64 pl-4 pr-10 py-2 bg-slate-100 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 rounded-full transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => router.push('/create-post')}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                写文章
              </Button>
            )}
            <div className="relative flex-1 w-full sm:w-auto">
              <Input
                type="text"
                placeholder="搜索文章..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 rounded-full transition-all duration-300"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-24 px-6">
        <div className="flex flex-col space-y-16">
          {filteredPosts.map((blog, index) => (
            <Link href={`/blog/${blog.ID}`} key={blog.ID}>
              <div className="group cursor-pointer relative py-20 md:py-32 px-10 md:px-20 rounded-[64px] border border-slate-100 dark:border-slate-900/50 hover:border-slate-200 dark:hover:border-slate-800 hover:bg-white dark:hover:bg-slate-900/30 transition-all duration-700 text-center">
                <time className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-8 block">
                  {new Date(blog.CreatedAt).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 tracking-tighter leading-tight">
                  {blog.Title}
                </h2>
              </div>
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

      <footer className="max-w-4xl mx-auto py-16 px-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 font-bold text-sm">
              Y
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Liam Yang</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">分享技术与思考</p>
            </div>
          </div>
          <a 
            href="mailto:yangqi2568@gmail.com" 
            className="text-sm text-slate-400 hover:text-blue-500 transition-colors"
          >
            yangqi2568@gmail.com
          </a>
        </div>
      </footer>
    </div>
  )
}