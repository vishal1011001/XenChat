export function FilterButtons() {
    return (
        <div className="flex felx-row w-full p-5 gap-2 *:text-white *:hover:bg-slate-700">
            <button className="border border-gray-500 pt-0.5 pb-0.5 p-2 rounded-2xl">All</button>
            <button className="border border-gray-500 pt-0.5 pb-0.5 p-2 rounded-2xl">Groups</button>
            <button className="border border-gray-500 pt-0.5 pb-0.5 p-2 rounded-2xl">DMs</button>
        </div>
    );
}