// api/blog.ts
import axios from 'axios';

const API_URL = 'http://47.93.28.209:8080/blogs';

export interface Blog {
    ID: number;
    Title: string;
    Content: string;
    CreatedAt: string; // ISO format string
    Category: string;
    Tags: string;
    ViewCount: number;
    Author: string;
}

export const fetchBlogs = async (): Promise<Blog[]> => {
    try {
        const response = await axios.get<Blog[]>(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw new Error("Failed to fetch blogs");
    }
};

export const fetchBlogByID = async (id: number): Promise<Blog> => {
    try {
        const response = await axios.get<Blog>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching blog with ID ${id}:`, error);
        throw new Error(`Failed to fetch blog with ID ${id}`);
    }
};

export const addBlog = async (newBlog: Omit<Blog, 'ID' | 'ViewCount' | 'CreatedAt'>): Promise<void> => {
    try {
        await axios.post(API_URL, newBlog);
    } catch (error) {
        console.error("Error adding blog:", error);
        throw new Error("Failed to add blog");
    }
};

export const deleteBlogByID = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting blog with ID ${id}:`, error);
        throw new Error(`Failed to delete blog with ID ${id}`);
    }
};

export const updateOrAddBlog = async (blog: Blog): Promise<void> => {
    try {
        await axios.post(`${API_URL}/updateOrAdd`, blog);
    } catch (error) {
        console.error("Error updating or adding blog:", error);
        throw new Error("Failed to update or add blog");
    }
};

// 上传图片到 OSS
export const uploadImageToOSS = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    try {
        const response = await axios.post<{ url: string }>('http://localhost:8080/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
};