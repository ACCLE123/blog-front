'use client'

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { fetchBlogByID, Blog } from '@/api/blog';

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
      <Card>
        <CardHeader>
          <CardTitle>{blog.Title}</CardTitle>
          <CardDescription>Published on {new Date(blog.CreatedAt).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          {blog.Content.replace(/\\n/g, '\n')}
        </CardContent>
        <CardFooter>
          <span>Written by {blog.Author}</span>
        </CardFooter>
      </Card>
    </div>
  );
}