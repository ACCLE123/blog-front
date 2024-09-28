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