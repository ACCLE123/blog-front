'use client'

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, easing } from '@/components/ui/card';
import { fetchBlogByID, Blog, deleteBlogByID } from '@/api/blog';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'
import { Button } from '@/components/ui/button'

export default function BlogPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 用于存储验证状态
  const blogId = Number(params.id); // 从 URL 获取 ID 参数
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('auth_token')
    if (token) {
      if (token === '20021221') { // 替换成你实际的 token 验证逻辑
        setIsAuthenticated(true);
      }
    }

    const fetchBlog = async () => {
      try {
        const fetchedBlog = await fetchBlogByID(blogId);
        setBlog(fetchedBlog);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleEdit = () => {
    router.push(`/create-post?blogId=${blogId}`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this blog?");
    if (confirmed) {
      try {
        await deleteBlogByID(blogId);
        alert("Blog deleted successfully!");
        router.push('/');
      } catch (err) {
        console.error(err);
        setError("Failed to delete the blog");
        alert("There was an error deleting the blog.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto py-12 px-6">
        <Card 
          className="w-full bg-gray-900/30 backdrop-blur-sm border border-gray-800/50"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{
            duration: 0.6,
            ease: easing,
          }}
        >
          <div className="p-10">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
                {blog.Title}
              </h1>
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
              {isAuthenticated && (
                <div className="flex space-x-4">
                  <Button
                    onClick={handleEdit}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
                  >
                    修改帖子
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
                  >
                    删除帖子
                  </Button>
                </div>
              )}
            </div>
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed text-base">
                <ReactMarkdown 
                  rehypePlugins={[]}
                  components={{
                    pre: ({ children }) => (
                      <pre className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 overflow-x-auto">
                        {children}
                      </pre>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-800/50 px-2 py-1 rounded-md text-sm border border-gray-700/50">
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
      </div>
    </div>
  );
}