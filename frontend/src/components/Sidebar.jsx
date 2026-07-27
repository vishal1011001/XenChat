export function Sidebar() {
    return (
        <div className="h-screen w-[5vw] bg-slate-800 flex flex-col">
            <div className="flex flex-col gap-2 items-center p-2 **:text-white">
                <button className=" w-10"><img src="/add.png"/></button>
                <button className=" w-10"><img src="/add.png"/></button>
                <button className=" w-10"><img src="/add.png"/></button>
            </div>
        </div>
    );
}