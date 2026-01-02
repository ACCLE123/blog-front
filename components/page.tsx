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
        <div className="max-w-[1400px] mx-auto py-5 px-8 flex items-center justify-between gap-12">
          {/* 左侧：品牌标识 */}
          <div className="flex items-center gap-6 shrink-0">
            <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">Liam's Blog</h1>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
            <p className="hidden md:block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Curated Thoughts</p>
          </div>

          {/* 中间：搜索框 - 占据剩余空间 */}
          <div className="flex-1 max-w-2xl relative hidden sm:block">
            <Input
              type="text"
              placeholder="探索文章内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 h-11 bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/5 rounded-2xl transition-all duration-500 text-sm"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* 右侧：动作与开关 */}
          <div className="flex items-center gap-6 shrink-0">
            {!isAuthenticated ? (
              <div className="relative group hidden lg:block">
                <Input
                  type="text"
                  placeholder="Token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onKeyDown={handleTokenKeyPress}
                  className="w-32 h-11 pl-4 pr-10 bg-transparent border-slate-200 dark:border-slate-800 focus:w-48 rounded-2xl transition-all duration-500 text-xs font-medium"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => router.push('/create-post')}
                className="bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-400 text-white h-11 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-slate-200 dark:shadow-none"
              >
                New Post
              </Button>
            )}
            <ThemeToggle />
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