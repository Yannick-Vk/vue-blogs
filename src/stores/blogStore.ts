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
    content: string;
}

export const useBlogStore = defineStore('blogs', () => {
    const blogs = ref<Array<Blog>>([]);
    const currentBlog = ref<BlogWithContent | null>(null);

    async function GetAllBlogs() {
        try {
            const response = await axios.get<Array<Blog>>(`${api}`);
            blogs.value = response.data;
        } catch (err) {
            console.error(err);
        }
    }

    async function getBlogById(id: string) {
        currentBlog.value = null;
        try {
            const response = await axios.get<BlogWithContent>(`${api}/${id}`);
            currentBlog.value = response.data;
        } catch (err) {
            console.error(err);
        }
    }

    return {blogs, currentBlog, GetAllBlogs, getBlogById};
})