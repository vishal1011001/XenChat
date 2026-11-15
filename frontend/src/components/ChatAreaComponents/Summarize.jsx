import axios from "axios";
import { useState } from "react";
import ReactMarkDown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Summarize({ API_URL, activeConvUid, setWantToSummarize }) {
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
                setSummary(response.data.summary);
                setTimeout(() => {
                    setGeneratingSummary(false);
                }, 2000);
            }
        } catch (error) {
            setGeneratingSummary(false);
            console.error("Error in summary response:", error)
        }
    }

    return (
        <div className="flex flex-col w-120 absolute bottom-14 right-5 rounded bg-slate-700 **:text-white z-2">
            <div className="rounded-t p-1">
                <h4 className="text-md text-purple-300! p-2">CHAT INSIGHTS</h4>
                <h4 className="text-sm pl-2">Get summary of recent messages</h4>
            </div>

            <button onClick={() => (setWantToSummarize(false))} className="absolute p-1 px-2 right-0 hover:bg-slate-600 mt-1 mr-1">CLOSE</button>

            <div className="p-4 flex justify-center border-b">
                <button
                    onClick={handleSummarize}
                    disabled={generatingSummary ? true : false}
                    className={`bg-white p-2 px-4 font-semibold rounded-lg text-slate-800! ${generatingSummary && 'disabled:opacity-60'}`}
                >{generatingSummary ? 'Generating...' : 'Generate Summary'}</button>
            </div>

            {generatingSummary ? (
                <div className="">
                    <div class="w-full h-1 bg-slate-200 dark:bg-slate-800 overflow-hidden rounded-full">
                        <div class="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full animate-[indeterminate_1.5s_infinite_ease-in-out] origin-left"></div>
                    </div>
                </div>
            ) : summary ? (
                <div className="rounded-b p-2 text-lg">
                    <ReactMarkDown remarkPlugins={[remarkGfm]}
                        components={{
                            ul: ({ node, ...props }) => (
                                <ul className="list-disc pl-5 space-y-1" {...props} />
                            ),
                            li: ({ node, ...props }) => (
                                <li className="text-slate-800" {...props} />
                            ),
                        }}
                    >
                        {summary.replace(/^"|"$/g, '').replace(/\\n/g, '\n')}
                    </ReactMarkDown>
                </div>
            ) : null}
        </div>
    );
}