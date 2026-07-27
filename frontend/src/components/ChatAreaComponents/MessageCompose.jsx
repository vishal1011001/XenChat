export function MessageCompose() {
    return (
        <div className="flex felx-col w-[66vw] gap-x-2 justify-center fixed bottom-2 self-center-safe z-2">
            <input placeholder="Type a message..."
                className="p-3 bg-blue-950 text-white rounded-4xl placeholder-white w-full"
            />
            <button className="text-slate-800 bg-white p-3 rounded-full">Send</button>
        </div>
    );
}