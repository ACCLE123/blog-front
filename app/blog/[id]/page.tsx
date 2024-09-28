import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const blogPosts = [
    { id: 1, title: "我的第一篇博客", createAt: "2023-09-27", content: "# Welcome to My Blog\n### hello\n` #include<iostream> `", author: 'yangqi' },
    { id: 2, title: "学习React的心得", createAt: "2023-09-28", content: "React真是一个强大的前端框架...", author: 'yangqi' },
    { id: 3, title: "旅行日记：巴黎", createAt: "2023-09-29", content: "巴黎是一座充满魅力的城市...", author: 'yangqi' },
]

function getBlogData(id: number) {
  return blogPosts.find(blog => blog.id === id);
}

export default function BlogPage({ params }: { params: { id: string } }) {
  const blog = getBlogData(Number(params.id));

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>{blog.title}</CardTitle>
          <CardDescription>Published on {blog.createAt}</CardDescription>
        </CardHeader>
        <CardContent>
            {blog.content}
        </CardContent>
        <CardFooter>
          <span>Written by {blog.author}</span>
        </CardFooter>
      </Card>
    </div>
  );
}