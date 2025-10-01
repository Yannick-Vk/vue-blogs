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
            }))
        } catch (err) {
            //console.error(err);
            if (isAxiosError(err)) {
                let errorMessage = err.message;
                if (err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
                    errorMessage = (err.response.data as { message: string }).message;
                }
                error.value = `Could not fetch blogs: ${errorMessage}`;
            } else if (err instanceof Error) {
                error.value = `Could not connect to the server. Please try again later`;
            } else {
                error.value = "Failed to fetch blogs, Unknown error";
            }
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
            if (isAxiosError(err)) {
                let errorMessage = err.message;
                if (err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
                    errorMessage = (err.response.data as { message: string }).message;
                }
                error.value = `Could not fetch blog: ${errorMessage}`;
            } else if (err instanceof Error) {
                error.value = `Could not fetch blog: ${err.message}`;
            } else {
                error.value = "Failed to fetch blog, Unknown error";
            }
        }
    }

    async function uploadBlog(blogData: {
        title: string;
        description: string;
        blogContent: string;
        bannerImage: File;
    }) {
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
                let errorMessage = err.message;
                if (err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
                    errorMessage = (err.response.data as { message: string }).message;
                }
                error.value = `Could not upload blog: ${errorMessage}`;
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
                let errorMessage = err.message;
                if (err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
                    errorMessage = (err.response.data as { message: string }).message;
                }
                error.value = `Could not delete blog: ${errorMessage}`;
            } else if (err instanceof Error) {
                error.value = `Could not delete blog: ${err.message}`;
            } else {
                error.value = "Failed to delete blog, Unknown error";
            }
        }
    }

    async function getBanner(blogId: string) {
        error.value = null;
        try {
            const response = await api.get(`blogs/${blogId}/banner`, {
                responseType: 'blob'
            })
            return URL.createObjectURL(response.data);
        } catch (err) {
            //console.warn("no banner for blog", blogId);
            return null;
        }
    }

    async function updateBlog(blogId: string, blogData: {
        title?: string;
        description?: string;
        blogContent?: string;
        bannerImage?: File;
    }) {
        error.value = null;
        try {
            const formData = new FormData();
            formData.append('Id', blogId);

            if (blogData.title !== undefined) formData.append('Title', blogData.title);
            if (blogData.description !== undefined) formData.append('Description', blogData.description);
            if (blogData.blogContent !== undefined) formData.append('BlogContent', blogData.blogContent);
            if (blogData.bannerImage) formData.append('BannerImage', blogData.bannerImage);

            await api.patch(`/blogs`, formData);
        } catch (err) {
            console.error(err);
            if (isAxiosError(err)) {
                let errorMessage = err.message;
                if (err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
                    errorMessage = (err.response.data as { message: string }).message;
                }
                error.value = `Could not update blog: ${errorMessage}`;
            } else if (err instanceof Error) {
                error.value = `Could not update blog: ${err.message}`;
            } else {
                error.value = "Failed to update blog, Unknown error";
            }
            throw new Error(error.value);
        }
    }

    async function updateAuthors(userIds: string[]) {
        error.value = null;
        try {
            userIds = userIds.filter(id => id.trim().length > 0)
            if(userIds.length <= 0) {
                throw new Error("No users supplied");
            }
            const blog: Blog = currentBlog.value;
            if (!blog) {
                throw new Error("Invalid blog Id");
            }

            await api.post(`/Blogs/${blog.id}/authors/add`, userIds);
        } catch (err) {
            console.error(err);
            if (isAxiosError(err)) {
                let errorMessage = err.message;
                if (err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
                    errorMessage = (err.response.data as { message: string }).message;
                }
                error.value = `Could not add Authors to blog: ${errorMessage}`;
            } else if (err instanceof Error) {
                error.value = `Could not add Authors to blog: ${err.message}`;
            } else {
                error.value = "Failed to add Authors, Unknown error";
            }
            throw new Error(error.value);
        }
    }

    return {blogs, currentBlog, error, getAllBlogs, getBlogById, uploadBlog, deleteBlog, getBanner, updateBlog, updateAuthors};
})