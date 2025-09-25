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
    created_at: string;
    updated_at?: string;
}

export const useBlogStore = defineStore('blogs', () => {
    const blogs = ref<Array<Blog>>([]);
    const currentBlog = ref<Blog | null>(null);

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
            const response = await axios.get<Blog>(`${api}/${id}`);
            currentBlog.value = response.data;
        } catch (err) {
            console.error(err);
        }
    }

    return {blogs, currentBlog, GetAllBlogs, getBlogById};
})