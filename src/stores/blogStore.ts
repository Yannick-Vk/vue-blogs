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
    bannerImage?: File;
}

interface ApiAuthor {
    id: string;
    username: string;
    email: string;
}

// This interface matches the API response
interface ApiBlog {
    id: string;
    title: string;
    authors: ApiAuthor[];
    description: string;
    createdAt: string;
    updatedAt?: string;
    bannerImage: File;
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
                authors: blog.authors.map(author => ({
                    name: author.username,
                    avatar: {
                        src: `https://i.pravatar.cc/32?u=${author.username}`,
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
                authors: blogData.authors.map(author => ({
                    name: author.username,
                    avatar: {
                        src: `https://i.pravatar.cc/32?u=${author.username}`
                    }
                }))
            };
        } catch (err) {
            console.error(err);
            error.value = "The server seems to be down. Please try again later.";
        }
    }

async function uploadBlog(blogData: { title: string; description: string; blogContent: string; bannerImage: File; }) {
        error.value = null;

        try {
            const formData = new FormData();
            formData.append('Title', blogData.title);
            formData.append('Description', blogData.description);
            formData.append('File', blogData.blogContent);
            formData.append('BannerImage', blogData.bannerImage);

            console.dir(formData);

            const blogId = await api.post<string>("/blogs", formData);
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