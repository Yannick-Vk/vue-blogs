import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {api_base_url} from "@/services/Api.ts";
import type {Author} from "@/types/Author.ts";

const api = `${api_base_url}/blogs`;

export interface Blog {
    id: string;
    title: string;
    authors: Author[];
    description: string;
    createdAt: string;
    updatedAt?: string;
    to?: string | object;
}

// This interface matches the API response
interface ApiBlog {
    id: string;
    title: string;
    authors: string[];
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
                to: `/blog/${blog.id}`,
                authors: blog.authors.map(authorName => ({
                    name: authorName,
                    avatar: {
                        src: `https://i.pravatar.cc/32?u=${authorName}`
                    }
                }))
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
                authors: blogData.authors.map(authorName => ({
                    name: authorName,
                    avatar: {
                        src: `https://i.pravatar.cc/32?u=${authorName}`
                    }
                }))
            };
            console.dir(currentBlog.value);
        } catch (err) {
            console.error(err);
            error.value = "The server seems to be down. Please try again later.";
        }
    }

    return {blogs, currentBlog, error, GetAllBlogs, getBlogById};
})