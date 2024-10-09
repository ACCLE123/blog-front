'use client'

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, easing } from '@/components/ui/card';
import { fetchBlogByID, Blog } from '@/api/blog';
import ReactMarkdown from 'react-markdown';

export default function BlogPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const blogId = Number(params.id); // 从 URL 获取 ID 参数

  useEffect(() => {
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