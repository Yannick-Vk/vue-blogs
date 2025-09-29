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
    cover?: string;
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

    async function getAllBlogs() {
        error.value = null;
        try {
            const response = await axios.get<Array<ApiBlog>>(`${api}`);
            blogs.value = response.data.map(blog => ({
                ...blog,
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

async function uploadBlog(blogData: { title: string; description: string; blogContent: File }) {
        error.value = null;

        const fileToBase64 = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    if (typeof reader.result === 'string') {
                        // The result includes a prefix like "data:text/markdown;base64,"
                        // We send the whole string for now, but some backends might want just the base64 part.
                        resolve(reader.result);
                    } else {
                        reject(new Error('Failed to read file as base64'));
                    }
                };
                reader.onerror = error => reject(error);
            });
        }

        try {
            const base64File = await fileToBase64(blogData.blogContent);

            const payload = {
                title: blogData.title,
                description: blogData.description,
                file: base64File,
                bannerImage: '' // Placeholder as the form does not have this field
            };

            await axios.post(api, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            await getAllBlogs(); // Refetch all blogs to include the new one

        } catch (err) {
            console.error(err);
            if (axios.isAxiosError(err) && err.response) {
                error.value = `Could not upload blog: ${err.response.data.message || err.message}`;
            } else if (err instanceof Error) {
                error.value = `Could not upload blog: ${err.message}`;
            } else {
                error.value = "Failed to upload blog, Unknown error";
            }
            throw new Error(error.value);
        }
    }

    return {blogs, currentBlog, error, getAllBlogs, getBlogById, uploadBlog};
})