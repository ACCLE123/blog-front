'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, MapPin, Linkedin, Github, Briefcase, GraduationCap, Wrench } from "lucide-react"

export function CompactResume() {
  const [activeTab, setActiveTab] = useState('profile')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="px-4 py-5 sm:px-6 flex items-center justify-between bg-gray-50">
          <motion.div className="flex items-center" variants={itemVariants}>
            <Avatar className="h-16 w-16 border-2 border-primary">
            
              <AvatarImage src="https://p.ipic.vip/57jvkk.png?height=64&width=64" alt="杨淇" className="object-cover" />
              <AvatarFallback>yangqi</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">杨淇</h1>
              <p className="text-lg text-gray-600">后端工程师</p>
            </div>
          </motion.div>
          <motion.div className="flex space-x-2" variants={itemVariants}>
            <a href="mailto:yangqi2568@gmail.com" className="text-gray-400 hover:text-gray-500">
              <Mail className="h-5 w-5" />
            </a>
            <a href="tel:+8617842273879" className="text-gray-400 hover:text-gray-500">
              <Phone className="h-5 w-5" />
            </a>
            <a href="https://github.com/ACCLE123" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <Github className="h-5 w-5" />
            </a>
          </motion.div>
        </div>
        <motion.div className="px-4 py-5 sm:p-6" variants={itemVariants}>
          <p className="text-sm text-gray-600">
            
          </p>
        </motion.div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">
              <Avatar className="mr-2 h-4 w-4" /> 个人资料
            </TabsTrigger>
            <TabsTrigger value="experience">
              <Briefcase className="mr-2 h-4 w-4" /> 工作经验
            </TabsTrigger>
            <TabsTrigger value="education">
              <GraduationCap className="mr-2 h-4 w-4" /> 教育背景
            </TabsTrigger>
            <TabsTrigger value="skills">
              <Wrench className="mr-2 h-4 w-4" /> 技能
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardContent className="pt-6">
                <motion.div variants={containerVariants} initial="hidden" animate={activeTab === 'profile' ? 'visible' : 'hidden'}>
                  <h3 className="font-semibold">个人资料</h3>
                  <p className="text-sm text-gray-600 mt-2">
                  熟悉 redis，熟悉 mysql，熟悉 Go(GMP、内存管理) 和 Java(JVM)，了解 k8s 和 istio。
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="experience">
            <Card>
              <CardContent className="pt-6">
                <motion.ul className="space-y-4" variants={containerVariants} initial="hidden" animate={activeTab === 'experience' ? 'visible' : 'hidden'}>
                  <motion.li variants={itemVariants}>
                    <h3 className="font-semibold">游戏服务端开发 - 网易互娱 广州</h3>
                    <p className="text-sm text-gray-600">2024年8月 - 2024年10月</p>
                    <ul className="list-disc list-inside mt-2 text-sm">
                      <li>使用 y3 编辑器完成地图开发，基于事件编程，实现小游戏。</li>
                      <li>使用内部 python 包，完成内部编辑器部分功能开发。</li>
                    </ul>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <h3 className="font-semibold">后端实习生 - Shopee 北京</h3>
                    <p className="text-sm text-gray-600">2024年7月 - 2024年8月</p>
                    <ul className="list-disc list-inside mt-2 text-sm">
                      <li>学习 k8s、istio 核心概念，参与灰度发布和熔断限流的实现。</li>
                      <li>使用 Gin 框架开发，并了解 Go 的 GMP 机制和内存管理机制。</li>
                    </ul>
                  </motion.li>
                </motion.ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="education">
            <Card>
              <CardContent className="pt-6">
                <motion.ul className="space-y-4" variants={containerVariants} initial="hidden" animate={activeTab === 'education' ? 'visible' : 'hidden'}>
                  <motion.li variants={itemVariants}>
                    <h3 className="font-semibold">计算机科学与技术 本科 - 南开大学</h3>
                    <p className="text-sm text-gray-600">2021年9月 - 至今</p>
                    <p className="mt-2 text-sm">主修课程：数据结构、算法分析、操作系统、数据库系统、计算机网络。</p>
                  </motion.li>
                </motion.ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="skills">
            <Card>
              <CardContent className="pt-6">
                <motion.div className="flex flex-wrap gap-2" variants={containerVariants} initial="hidden" animate={activeTab === 'skills' ? 'visible' : 'hidden'}>
                  {['Go', 'Redis', 'MySQL', 'Gin', 'Java', 'Spring Boot', 'K8s', 'Istio', 'Git', 'Docker', 'Prometheus'].map((skill, index) => (
                    <motion.div key={skill} variants={itemVariants} custom={index}>
                      <Badge variant="secondary">{skill}</Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}