'use client'

import { useEffect, useState, useRef } from 'react';
import { Card, easing } from '@/components/ui/card';
import { fetchBlogByID, Blog, deleteBlogByID } from '@/api/blog';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { motion, useScroll, useSpring } from 'framer-motion'

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function BlogPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  
  const blogId = Number(params.id);
  const router = useRouter();

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
  
  // 进度条控制
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 递归提取 React 节点中的纯文本
  const getRawText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getRawText).join('');
    if (node?.props?.children) return getRawText(node.props.children);
    return '';
  };

  // 统一 ID 生成函数
  const generateId = (text: string) => {
    return text.toLowerCase()
      .trim()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    const token = Cookies.get('auth_token')
    if (token === '20021221') setIsAuthenticated(true);

    const fetchBlog = async () => {
      try {
        const fetchedBlog = await fetchBlogByID(blogId);
        setBlog(fetchedBlog);
        
        // 提取目录
        const headings: TOCItem[] = [];
        const rawContent = fetchedBlog.Content.replace(/\\n/g, '\n');
        // 排除代码块中的 #
        const cleanContent = rawContent.replace(/```[\s\S]*?```/g, '');
        // 匹配 # ## ### 标题，考虑标题内可能含有 markdown 语法
        const headingRegex = /^(#{1,3})\s+(.+)$/gm;
        let match;
        
        while ((match = headingRegex.exec(cleanContent)) !== null) {
          const level = match[1].length;
          // 移除标题内的 markdown 语法符号以便生成 ID
          const rawText = match[2].replace(/[*_`\[\]()]/g, '').trim();
          headings.push({
            level,
            text: rawText,
            id: generateId(rawText)
          });
        }
        setToc(headings);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  // 监听滚动以高亮当前章节 - 优化算法
  useEffect(() => {
    if (toc.length === 0 || loading) return;

    const handleScroll = () => {
      const headings = toc.map(item => document.getElementById(item.id)).filter(Boolean);
      if (headings.length === 0) return;

      // 找到距离视口顶部最近且在视口顶部的标题
      let currentActiveId = toc[0].id;
      const scrollOffset = 100; // 触发偏移量

      for (const heading of headings) {
        if (heading!.getBoundingClientRect().top <= scrollOffset) {
          currentActiveId = heading!.id;
        } else {
          break;
        }
      }
      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始化

    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc, loading]);

  if (loading) return <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] flex items-center justify-center text-slate-400">加载中...</div>;
  if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-400">{error}</div>;
  if (!blog) return <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">Blog not found</div>;

  const wordCount = blog.Content.length;

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* 顶部导航栏 */}
      <header className="bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        {/* 全局进度条融合 */}
        <motion.div 
          className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-blue-500 origin-left z-50"
          style={{ scaleX }}
        />
        
        <div className="max-w-[1400px] mx-auto py-5 px-8 flex items-center justify-between gap-12">
          {/* 左侧：品牌标识 & 返回 */}
          <div className="flex items-center gap-6 shrink-0">
            <button 
              onClick={() => router.push('/')}
              className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-xs font-black uppercase tracking-widest hidden sm:block">Back</span>
            </button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
            <h1 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white uppercase hidden sm:block">Liam's Blog</h1>
          </div>

          {/* 右侧：动作与开关 */}
          <div className="flex items-center gap-6 shrink-0">
            {isAuthenticated && (
              <div className="flex items-center gap-4 border-r border-slate-100 dark:border-slate-800 pr-6 mr-0">
                <Button 
                  onClick={handleEdit} 
                  variant="ghost" 
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Edit
                </Button>
                <Button 
                  onClick={handleDelete} 
                  variant="ghost" 
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  Delete
                </Button>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-16 px-6 relative flex gap-12">
        {/* 侧边融合目录 - 靠最左固定 */}
        <aside className="hidden xl:block fixed left-10 top-40 w-60 h-fit z-40">
          <div className="relative pl-6 border-l border-slate-100 dark:border-slate-800">
            <div className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Navigation</div>
            <div className="space-y-5">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(item.id);
                    if (el) {
                      const offset = 120;
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = el.getBoundingClientRect().top;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`block text-xs transition-all duration-500 ${
                    activeId === item.id 
                      ? 'text-blue-600 dark:text-blue-400 font-bold translate-x-2' 
                      : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                  }`}
                  style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                >
                  {item.text}
                </a>
              ))}
            </div>
            
            {/* 纵向进度指示器 - 更加明显的靠左线条 */}
            <motion.div 
              className="absolute left-[-1px] top-0 w-[2px] bg-blue-500 rounded-full"
              style={{ 
                height: scaleX, // 将顶部进度条的逻辑也应用到这里，实现同步
                transformOrigin: 'top'
              }}
            />
          </div>
        </aside>

        {/* 正文内容 - 增加左侧间距给目录留出视觉空间 */}
        <div className="flex-1 max-w-3xl xl:ml-32">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.2]">
              {blog.Title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 dark:text-slate-500 font-medium border-b border-slate-100 dark:border-slate-800 pb-8">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">Date</span>
                <span className="text-slate-500 dark:text-slate-400">{new Date(blog.CreatedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Count</span>
                <span className="text-slate-500 dark:text-slate-400">{wordCount} 字</span>
              </div>
            </div>
          </div>

          <article className="prose prose-slate dark:prose-invert prose-lg max-w-none 
            prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
            prose-headings:scroll-mt-32
            prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-[1.8] prose-p:text-lg
            prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-bold
            prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:shadow-xl prose-pre:rounded-2xl
            prose-blockquote:border-l-4 prose-blockquote:border-slate-200 dark:prose-blockquote:border-slate-800 prose-blockquote:italic prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900/50 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl
            prose-img:rounded-3xl prose-img:shadow-2xl
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
          ">
            <ReactMarkdown 
              rehypePlugins={[]}
              components={{
                h1: ({ children }) => {
                  const rawText = getRawText(children);
                  const id = generateId(rawText);
                  return <h1 id={id}>{children}</h1>;
                },
                h2: ({ children }) => {
                  const rawText = getRawText(children);
                  const id = generateId(rawText);
                  return <h2 id={id}>{children}</h2>;
                },
                h3: ({ children }) => {
                  const rawText = getRawText(children);
                  const id = generateId(rawText);
                  return <h3 id={id}>{children}</h3>;
                },
                p: ({ children }) => (
                  <div className="mb-0 whitespace-pre-wrap min-h-[1.8em]">{children}</div>
                ),
                pre: ({ children }) => (
                  <div className="my-10 relative group">
                    <pre className="relative overflow-x-auto p-8 rounded-2xl bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 border border-slate-800 dark:border-slate-900 shadow-2xl">
                      {children}
                    </pre>
                  </div>
                ),
              }}
            >
              {blog.Content
                .replace(/\\n/g, '\n')
                .split('\n')
                .map(line => {
                  if (line.trim() === '') return '\u00a0';
                  return line.replace(/^ +/, (match) => '\u00a0'.repeat(match.length));
                })
                .join('\n\n')}
            </ReactMarkdown>
          </article>

          <footer className="mt-32 pt-16 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col items-center gap-4 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 font-bold text-sm">Y</div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Liam Yang</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">分享技术与思考</p>
                </div>
              </div>
              <a href="mailto:yangqi2568@gmail.com" className="text-sm text-slate-400 hover:text-blue-500 transition-colors">yangqi2568@gmail.com</a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}