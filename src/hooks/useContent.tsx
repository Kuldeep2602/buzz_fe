import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

interface ContentItem {
    id: string;
    type: string;
    link: string;
    title: string;
    contentId?: string;
}

export function useContent() {
    const [contents, setContents] = useState<ContentItem[]>([]);

    function refresh() {
        axios.get(`${BACKEND_URL}/api/v1/content`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
            .then((response) => {
                setContents(response.data.content)
            })
    }

    useEffect(() => {
        refresh()
        const interval = setInterval(() => {
            refresh()
        }, 10 * 1000)

        return () => {
            clearInterval(interval);
        }
    }, [])

    const deleteContent = async (contentId: string) => {
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/content`, {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                data: { contentId }
            });
            
            // Remove the deleted content from the local state
            setContents(prevContents => prevContents.filter(content => content.id !== contentId));
        } catch (error) {
            console.error('Error deleting content:', error);
            throw error; // Re-throw to handle in the component if needed
        }
    };

    return { contents, refresh, deleteContent };
}