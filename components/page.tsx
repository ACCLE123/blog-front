// page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, easing } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { fetchBlogs, Blog } from '@/api/blog'
import ReactMarkdown from 'react-markdown';

export function Page() {
  const [searchTerm, setSearchTerm] = useState('')
  const [blogPosts, setBlogPosts] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const blogs = await fetchBlogs();
        setBlogPosts(blogs);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, []);

  const filteredPosts = blogPosts.filter(post =>
    post.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.Content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center">加载中...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">yangqi</h1>
            <Link href="/resume">简历</Link>
          </div> */}
          
          <div className="relative">
            <Input
              type="text"
              placeholder="搜索文章..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-5"
              whileFocus={{ scale: 1.02, transition: { duration: 0.3, ease: easing } }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2, ease: easing } }}
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
  );
}