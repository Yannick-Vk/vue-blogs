import {defineStore} from "pinia";
import {ref} from "vue";
import type {Author} from "@/types/Author.ts";
import {api, isAxiosError} from '@/services/Api.ts'

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
            const response = await api.get<Array<ApiBlog>>(`blogs/`);
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
            const response = await api.get<ApiBlogWithContent>(`blogs/${id}`);
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

            const blogId = await api.post<string>("/blogs", payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Created new blog with id", blogId.data);
            return blogId.data;

        } catch (err) {
            console.error(err);
            if (isAxiosError(err)) {
                error.value = `Could not upload blog: ${err.response.data.message || err.message}`;
            } else if (err instanceof Error) {
                error.value = `Could not upload blog: ${err.message}`;
            } else {
                error.value = "Failed to upload blog, Unknown error";
            }
            throw new Error(error.value);
        }
    }

    async function deleteBlog(blogId: string) {
        error.value = null;
        try {
            const blog = await api.delete<Blog>(`blogs/${blogId}`)
            return blog.data;
        } catch (err) {
            console.error(err);
            if (isAxiosError(err)) {
                error.value = `Could not delete blog: ${err.response.data.message || err.message}`;
            } else if (err instanceof Error) {
                error.value = `Could not delete blog: ${err.message}`;
            } else {
                error.value = "Failed to delete blog, Unknown error";
            }
        }
    }

    return {blogs, currentBlog, error, getAllBlogs, getBlogById, uploadBlog, deleteBlog};
})