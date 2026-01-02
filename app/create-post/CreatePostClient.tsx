'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { Blog, fetchBlogByID, updateOrAddBlog, uploadImageToOSS } from '@/api/blog'
import { ThemeToggle } from '@/components/theme-toggle'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

export default function CreatePostClient() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [vditor, setVditor] = useState<Vditor>()
  const router = useRouter();
  const searchParams = useSearchParams(); 

  const blogId = Number(searchParams.get('blogId'));
  const vditorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vditorContainerRef.current) return;

    const vditorInstance = new Vditor(vditorContainerRef.current, {
      height: 'calc(100vh - 64px)',
      mode: 'ir', // 即时渲染模式 (Typora 模式)
      toolbar: [], // 彻底隐藏工具栏
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'classic',
      placeholder: '开始创作你的故事...',
      outline: {
        enable: true,
        position: 'left',
      },
      cache: {
        enable: false,
      },
      after: () => {
        // 如果是编辑模式，初始化内容
        if (blogId !== 0) {
          fetchBlogByID(blogId).then(blog => {
            setTitle(blog.Title);
            vditorInstance.setValue(blog.Content);
          });
        }
        setVditor(vditorInstance);
      },
      input: (value) => {
        setContent(value);
      },
      upload: {
        handler: async (files: File[]): Promise<any> => {
          const file = files[0];
          try {
            const url = await uploadImageToOSS(file);
            vditorInstance.insertValue(`![image](${url})`);
            return null;
          } catch (error) {
            console.error(error);
            return '上传失败';
          }
        }
      }
    });

    return () => {
      if (vditorInstance) {
        try {
          // 增加安全判断，防止在 Next.js 热更新或严格模式下销毁未完全初始化的实例
          if (vditorInstance.vditor && vditorInstance.vditor.element) {
            vditorInstance.destroy();
          }
        } catch (e) {
          console.error('Vditor destroy failed:', e);
        }
      }
    };
  }, []);

  // 监听主题变化更新 Vditor 主题
  useEffect(() => {
    if (!vditor) return;

    // 创建观察器监听 html 标签的 class 变化
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      vditor.setTheme(
        isDark ? 'dark' : 'classic', 
        isDark ? 'dark' : 'light'
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [vditor]);

  const handlePublish = async () => {
    const finalContent = vditor ? vditor.getValue() : content;
    if (!title.trim() || !finalContent.trim()) {
      alert('标题和内容不能为空！')
      return
    }
    
    const blog: Blog = {
      ID: blogId,
      Title: title,
      Content: finalContent,
      CreatedAt: new Date().toISOString(),
      Category: 'Tech',
      Tags: 'JavaScript, Programming',
      ViewCount: 100,
      Author: 'Liam',
    };
  
    setIsLoading(true)
    try {
      await updateOrAddBlog(blog);
      alert('文章发布/更新成功！');
      router.push('/')
    } catch (error) {
      console.error(error);
      alert('发布失败，请检查网络！');
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      {/* 顶部导航栏 */}
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
            <ThemeToggle />
            <Button 
              onClick={handlePublish} 
              disabled={isLoading} 
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full px-6 py-2 h-auto text-sm font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
            >
              {isLoading ? '...' : (blogId !== 0 ? '保存' : '发布')}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto h-[calc(100vh-64px)] overflow-hidden bg-[#f8fafc] dark:bg-[#080808]">
        {/* Vditor 容器 */}
        <div ref={vditorContainerRef} className="vditor-container h-full overflow-hidden" />
      </main>

      <style jsx global>{`
        .vditor {
          border: none !important;
          background-color: transparent !important;
        }
        .vditor-toolbar {
          display: none !important;
        }
        .vditor-content {
          background-color: transparent !important;
        }
        /* 核心修复：更宽大的编辑区域 */
        .vditor-ir {
          padding: 80px 100px !important; /* 进一步增加内边距提升极致沉浸感 */
          max-width: 1200px !important; 
          margin: 0 auto !important;
          background-color: #ffffff !important;
          color: #1e293b !important;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
          border-radius: 16px !important;
          min-height: calc(100vh - 100px) !important; 
          font-size: 18px !important; 
          line-height: 2 !important; /* 增加行高到 2，让文字更具呼吸感 */
        }
        .dark .vditor-ir {
          background-color: #0a0a0a !important;
          color: #f1f5f9 !important;
          box-shadow: none !important;
          border: 1px solid #1e293b !important;
        }
        /* 确保有序列表和无序列表的样式 */
        .vditor-reset ol {
          list-style-type: decimal !important;
          padding-left: 20px !important;
        }
        .vditor-reset ul {
          list-style-type: disc !important;
          padding-left: 20px !important;
        }
        .vditor-toolbar__item button {
          color: #64748b !important;
        }
        .dark .vditor-toolbar__item button {
          color: #94a3b8 !important;
        }
        .vditor-outline {
          border-right: 1px solid #f1f5f9 !important;
          background-color: #fcfcfc !important;
        }
        .dark .vditor-outline {
          border-right: 1px solid #1e293b !important;
          background-color: #050505 !important;
        }
      `}</style>
    </div>
  )
}
