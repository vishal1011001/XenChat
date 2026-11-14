export function BotOptions({setWantToSummarize, setBotOptionsOpen}) {
    const summarizeClick = () => {
        setWantToSummarize(true);
        setBotOptionsOpen(false);
    }

    return (
        <div className="flex flex-col p-0! rounded! bottom-12.5 right-40 absolute bg-slate-800 z-3 w-[12%] *:flex *:hover:bg-slate-700 *:px-2 *:py-1">
            <button
                onClick={summarizeClick}
            >Summarize</button>
        </div>
    );
}