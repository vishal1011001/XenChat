export function HeaderBar() {
    return (
        <div className="h-18 w-6xl bg-slate-900 border-l border-white flex flex-row pl-6 gap-2 items-center z-2 fixed top-0" >
            <img src="/pfp1.png" className="h-10 rounded-full"/>
            <h2 className="text-2xl text-white font-semibold">Vishal Jakhar</h2>
        </div>
    );
}