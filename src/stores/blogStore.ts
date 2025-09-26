import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {api_base_url} from "@/services/Api.ts";

const api = `${api_base_url}/blogs`;

export interface Blog {
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

export const useBlogStore = defineStore('blogs', () => {
    const blogs = ref<Array<Blog>>([]);
    const currentBlog = ref<BlogWithContent | null>(null);
    const error = ref<string | null>(null);

    async function GetAllBlogs() {
        error.value = null;
        try {
            const response = await axios.get<Array<Blog>>(`${api}`);
            blogs.value = response.data;
        } catch (err) {
            console.error(err);
            error.value = "The server seems to be down. Please try again later.";
        }
    }

    async function getBlogById(id: string) {
        currentBlog.value = null;
        error.value = null;
        try {
            const response = await axios.get<BlogWithContent>(`${api}/${id}`);
            console.dir(response.data);
            currentBlog.value = response.data;
        } catch (err) {
            console.error(err);
            error.value = "The server seems to be down. Please try again later.";
        }
    }

    return {blogs, currentBlog, error, GetAllBlogs, getBlogById};
})