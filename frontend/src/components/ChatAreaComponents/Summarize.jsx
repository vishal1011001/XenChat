import axios from "axios";
import { useState } from "react";
import ReactMarkDown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Summarize({API_URL, activeConvUid}) {
    const [summary, setSummary] = useState('');
    const [generatingSummary, setGeneratingSummary] = useState(false);

    const handleSummarize = async () => {
        setGeneratingSummary(true);

        try {
            const token = localStorage.getItem('xen_access_token');
            const response = await axios.get(`${API_URL}/chatbot/summarize/${activeConvUid}/20`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status >= 200 && response.status < 300) {
                setGeneratingSummary(false);
                setSummary(JSON.stringify(response.data.summary));
            }
        } catch (error) {
            setGeneratingSummary(false);
            console.error("Error in summary response:", error)
        }
    }

    return (
        <div className="flex flex-col absolute bottom-14 rounded bg-white p-2 pt-1 z-2">
            <div>
                <h4 className="text-lg">Summary of unread messages:</h4>
            </div>

            <div>
                <p>Click to Summarize past messages of this chat</p>
                <button
                    onClick={handleSummarize}
                    className="bg-gray-300 p-2"
                >SUMMARIZE</button>
            </div>

            {generatingSummary && (
                <div className="">Generating...</div>
            )}

            {summary && (
                <ReactMarkDown remarkPlugins={[remarkGfm]} >
                    {summary}
                </ReactMarkDown>
            )}
        </div>
    );
}