import {defineStore} from "pinia";
import {ref} from "vue";
import type {Author} from "@/types/Author.ts";
import {api, isAxiosError} from '@/services/Api.ts'
import {useProfileStore} from "@/stores/profileStore.ts";

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
    const loading = ref(false);
    const bannerCache = ref(new Map<string, string | null>());
    const profileStore = useProfileStore();

    async function getAllBlogs() {
        error.value = null;
        try {
            const response = await api.get<Array<ApiBlog>>(`blogs/`);
            blogs.value = await Promise.all(response.data.map(async (blog) => {
                const authors = await Promise.all(blog.authors.map(async (author) => {
                    const profilePic = await profileStore.getProfilePicture(author.id);
                    return {
                        id: author.id,
                        name: author.username,
                        avatar: {
                            src: profilePic || `https://i.pravatar.cc/32?u=${author.username}`,
                        }
                    };
                }));
                return {
                    ...blog,
                    authors,
                };
            }));
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
                    id: author.id,
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
        if (bannerCache.value.has(blogId)) {
            return bannerCache.value.get(blogId)!;
        }

        error.value = null;
        try {
            const response = await api.get(`blogs/${blogId}/banner`, {
                responseType: 'blob'
            })
            const bannerUrl = URL.createObjectURL(response.data);
            bannerCache.value.set(blogId, bannerUrl);
            return bannerUrl;
        } catch (err) {
            bannerCache.value.set(blogId, null);
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
            if (userIds.length <= 0) {
                throw new Error("No users supplied");
            }
            const blog: Blog | null = currentBlog.value;
            if (!blog) {
                throw new Error("Invalid blog Id");
            }

            const currentAuthorIds = new Set(blog.authors.map(a => a.id));

            const toAdd = userIds.filter(id => !currentAuthorIds.has(id));
            const toRemove = userIds.filter(id => currentAuthorIds.has(id));

            if (toAdd.length > 0) {
                await api.post(`/blogs/${blog.id}/authors/add`, toAdd);
            }
            if (toRemove.length > 0) {
                await api.post(`/blogs/${blog.id}/authors/remove`, toRemove);
            }
            // Update the current state
            await getBlogById(blog.id);
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

    async function getBlogsByUser() {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.get<Array<ApiBlog>>(`/blogs/author/me`);
            blogs.value = response.data.map(blog => ({
                ...blog,
                authors: blog.authors.map(author => ({
                    id: author.id,
                    name: author.username,
                    avatar: {
                        src: `https://i.pravatar.cc/32?u=${author.username}`,
                    }
                }))
            }))
        } catch (err) {
            console.error(err);
            if (isAxiosError(err)) {
                let errorMessage = err.message;
                if (err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
                    errorMessage = (err.response.data as { message: string }).message;
                }
                error.value = `Could not get blogs: ${errorMessage}`;
            } else if (err instanceof Error) {
                error.value = `Could not get blogs: ${err.message}`;
            } else {
                error.value = "Failed to get blogs, Unknown error";
            }
            throw new Error(error.value);
        } finally {
            loading.value = false;
        }
    }

    return {
        blogs,
        currentBlog,
        error,
        loading,
        getAllBlogs,
        getBlogById,
        uploadBlog,
        deleteBlog,
        getBanner,
        updateBlog,
        updateAuthors,
        getBlogsByUser
    };
})
