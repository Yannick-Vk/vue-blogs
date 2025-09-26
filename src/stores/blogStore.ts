import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {api_base_url} from "@/services/Api.ts";
import type {Author} from "@/types/Author.ts";

const api = `${api_base_url}/blogs`;

export interface Blog {
    id: number;
    title: string;
    authors: Author[];
    description: string;
    createdAt: string;
    updatedAt?: string;
    path: string;
}

// This interface matches the API response
interface ApiBlog {
    id: number;
    title: string;
    author: string;
    description: string;
    createdAt: string;
    updatedAt?: string;
}

export interface BlogWithContent extends Blog {
    blogContent: string;
}

interface ApiBlogWithContent extends ApiBlog {
    blogContent: string;
}

export const useBlogStore = defineStore('blogs', () => {
    const blogs = ref<Array<Blog>>([]);
    const currentBlog = ref<BlogWithContent | null>(null);
    const error = ref<string | null>(null);

    async function GetAllBlogs() {
        error.value = null;
        try {
            const response = await axios.get<Array<ApiBlog>>(`${api}`);
            blogs.value = response.data.map(blog => ({
                ...blog,
                authors: [{
                    name: blog.author,
                    avatar: {
                        src: `https://i.pravatar.cc/64?u=${blog.author}`
                    }
                }],
                path: `/blog/${blog.id}`,
            }));
        } catch (err) {
            console.error(err);
            error.value = "The server seems to be down. Please try again later.";
        }
    }

    async function getBlogById(id: string) {
        currentBlog.value = null;
        error.value = null;
        try {
            const response = await axios.get<ApiBlogWithContent>(`${api}/${id}`);
            const blogData = response.data;
            currentBlog.value = {
                ...blogData,
                authors: [{
                    name: blogData.author,
                    avatar: {
                        src: `https://i.pravatar.cc/32?u=${blogData.author}`
                    }
                }],
                path: "",
            };
            console.dir(currentBlog.value);
        } catch (err) {
            console.error(err);
            error.value = "The server seems to be down. Please try again later.";
        }
    }

    return {blogs, currentBlog, error, GetAllBlogs, getBlogById};
})