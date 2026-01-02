'use client'

import { useEffect, useState, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { Blog, fetchBlogByID, updateOrAddBlog, uploadImageToOSS } from '@/api/blog'
import ReactMarkdown from 'react-markdown'
import { ThemeToggle } from '@/components/theme-toggle'
import { motion } from 'framer-motion'

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function CreatePostClient() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toc, setToc] = useState<TOCItem[]>([])
  const router = useRouter();
  const searchParams = useSearchParams(); 

  const blogId = Number(searchParams.get('blogId'));
  
  const editRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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

  // 实时提取目录
  useEffect(() => {
    const headings: TOCItem[] = [];
    const cleanContent = content.replace(/```[\s\S]*?```/g, '');
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    let match;
    
    while ((match = headingRegex.exec(cleanContent)) !== null) {
      const level = match[1].length;
      const rawText = match[2].replace(/[*_`\[\]()]/g, '').trim();
      headings.push({
        level,
        text: rawText,
        id: generateId(rawText)
      });
    }
    setToc(headings);
  }, [content]);

  // 滚动同步
  const handleScroll = () => {
    if (!editRef.current || !previewRef.current) return;
    
    const editArea = editRef.current;
    const previewArea = previewRef.current;
    
    // 计算滚动的百分比
    const scrollPercentage = editArea.scrollTop / (editArea.scrollHeight - editArea.clientHeight);
    
    // 同步预览区的滚动位置
    previewArea.scrollTop = scrollPercentage * (previewArea.scrollHeight - previewArea.clientHeight);
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetchBlogByID(blogId);
        setTitle(response.Title)
        setContent(response.Content)
      } catch (error) {
        console.error(error);
        alert('Failed to get blog!');
      }
    };

    if (blogId !== 0) {
      fetchBlog();
    }
  }, [blogId])

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert('标题和内容不能为空！')
      return
    }
    
    const blog: Blog = {
      ID: blogId,
      Title: title,
      Content: content,
      CreatedAt: new Date().toISOString(),
      Category: 'Tech',
      Tags: 'JavaScript, Programming',
      ViewCount: 100,
      Author: 'Liam',
    };
  
    setIsLoading(true)
    try {
      await updateOrAddBlog(blog);
      alert('Blog updated or added successfully!');
      router.push('/')
    } catch (error) {
      console.error(error);
      alert('Failed to update or add blog!');
    } finally {
      setIsLoading(false)
    }
  }

  // 粘贴图片上传并插入 markdown
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          try {
            const url = await uploadImageToOSS(file);
            const markdown = `![image](${url})`;
            insertAtCursor(markdown);
          } catch (error) {
            console.error(error);
            alert('图片上传失败');
          }
          e.preventDefault();
          break;
        }
      }
    }
  };

  // 在光标处插入文本
  const insertAtCursor = (text: string) => {
    const textarea = document.activeElement as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);
    setContent(before + text + after);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* 顶部导航栏 - 将标题移入此处以解决不对称问题 */}
      <header className="bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto py-3 px-6 flex items-center gap-8">
          <Button 
            onClick={() => router.push('/')}
            variant="ghost" 
            className="p-0 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-transparent transition-colors flex items-center gap-2 font-medium shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回
          </Button>

          {/* 核心改动：标题输入框移入导航栏中央 */}
          <div className="flex-1 flex justify-center">
            <input
              type="text"
              placeholder="在这里输入文章标题..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full max-w-2xl text-center text-lg font-bold bg-transparent border-none outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="hidden md:inline text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {blogId !== 0 ? 'Editing' : 'Draft'}
            </span>
            <ThemeToggle />
            <Button 
              onClick={handlePublish} 
              disabled={isLoading} 
              className="bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white text-white rounded-full px-6 py-2 h-auto text-sm font-bold shadow-lg shadow-slate-200 dark:shadow-none transition-all active:scale-95"
            >
              {isLoading ? '...' : (blogId !== 0 ? '保存' : '发布')}
            </Button>
          </div>
        </div>
      </header>

      {/* 编辑页侧边导航栏 - 降低显示门槛 */}
      <aside className="hidden xl:block fixed left-4 2xl:left-10 top-40 w-56 h-fit z-40">
        <div className="relative pl-6 border-l border-slate-100 dark:border-slate-800">
          <div className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Navigation</div>
          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-4 scrollbar-none">
            {toc.length > 0 ? toc.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  // 1. 同步滚动右侧预览区
                  const previewEl = document.getElementById(`preview-${item.id}`);
                  if (previewEl && previewRef.current) {
                    previewEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }

                  // 2. 同步滚动左侧编辑区
                  if (editRef.current) {
                    const text = content;
                    // 寻找标题在原文中的位置（考虑 Markdown 语法）
                    const headingMarkdown = `${'#'.repeat(item.level)} ${item.text}`;
                    const index = text.indexOf(headingMarkdown);
                    
                    if (index !== -1) {
                      const totalLines = text.split('\n').length;
                      const textBefore = text.substring(0, index);
                      const currentLine = textBefore.split('\n').length;
                      
                      // 计算大致的滚动高度百分比
                      const scrollRatio = (currentLine - 1) / totalLines;
                      const targetScrollTop = scrollRatio * (editRef.current.scrollHeight - editRef.current.clientHeight);
                      
                      editRef.current.scrollTo({
                        top: targetScrollTop,
                        behavior: 'smooth'
                      });
                    }
                  }
                }}
                className="block text-left text-[11px] text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 hover:translate-x-1"
                style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
              >
                {item.text}
              </button>
            )) : (
              <p className="text-[10px] text-slate-300 dark:text-slate-700 italic">No headings yet</p>
            )}
          </div>
        </div>
      </aside>

      <main className="max-w-[1600px] mx-auto xl:pl-80 h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 h-full">
          {/* 左侧：编辑区 */}
          <div className="py-12 px-10 md:px-0 h-full flex flex-col">
            <div className="relative group flex-1">
              <textarea
                ref={editRef}
                onScroll={handleScroll}
                placeholder="开始你的创作..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onPaste={handlePaste}
                className="w-full h-full text-lg bg-transparent border-none outline-none resize-none placeholder:text-slate-300 dark:placeholder:text-slate-700 leading-relaxed text-slate-700 dark:text-slate-300 scrollbar-none"
              />
              <div className="absolute left-[-24px] top-0 bottom-0 w-[2px] bg-slate-100 dark:bg-slate-800 group-focus-within:bg-blue-500 transition-colors"></div>
            </div>
          </div>

          {/* 右侧：预览区 */}
          <div className="hidden lg:block border-l border-slate-100 dark:border-slate-800 h-full overflow-hidden">
            <div className="h-full py-12 pl-24 pr-8 overflow-y-auto" ref={previewRef} onScroll={handleScroll}>
              <div 
                className="prose prose-slate dark:prose-invert prose-lg max-w-none 
                prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-black
                prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
                prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/20 prose-code:px-1 prose-code:rounded
                prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:rounded-xl
              ">
                <ReactMarkdown 
                  rehypePlugins={[]}
                  components={{
                    h1: ({ children }) => <h1 id={`preview-${generateId(getRawText(children))}`}>{children}</h1>,
                    h2: ({ children }) => <h2 id={`preview-${generateId(getRawText(children))}`}>{children}</h2>,
                    h3: ({ children }) => <h3 id={`preview-${generateId(getRawText(children))}`}>{children}</h3>,
                    p: ({ children }) => (
                      <div className="mb-0 whitespace-pre-wrap min-h-[1.8em]">{children}</div>
                    ),
                    pre: ({ children }) => (
                      <pre className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 border border-slate-800 dark:border-slate-900">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {content
                    .split('\n')
                    .map(line => {
                      if (line.trim() === '') return '\u00a0';
                      return line.replace(/^ +/, (match) => '\u00a0'.repeat(match.length));
                    })
                    .join('\n\n')}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}