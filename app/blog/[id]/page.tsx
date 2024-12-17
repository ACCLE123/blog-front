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
        setError("Failed to delete the blog");
        alert("There was an error deleting the blog.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <Card
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          duration: 0.6,
          ease: easing,
        }}
      >
        <CardHeader>
          <CardTitle>{blog.Title}</CardTitle>
          <CardDescription>
            Published on {new Date(blog.CreatedAt).toLocaleDateString()}
          </CardDescription>
          {isAuthenticated && (
            <div className="flex space-x-4">
              <Button
                onClick={handleEdit}
                className="px-4 py-2 text-white rounded"
              >
                修改帖子
              </Button>
              <Button
                onClick={handleDelete}
                className="px-4 py-2 text-white rounded"
              >
                删除帖子
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="prose">
          <ReactMarkdown rehypePlugins={[]}>
            {blog.Content.replace(/\\n/g, '\n')}
          </ReactMarkdown>
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>
    </div>
  );
}