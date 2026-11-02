import { FileContent } from "./FileContent";

export function HeaderBar({ displayName, displayPfpUid }) {
    return (
        <div className="h-18 w-6xl bg-slate-900 border-l border-white flex flex-row pl-6 gap-2 items-center z-2 fixed top-0" >
            {displayPfpUid ? (
                <FileContent file_uid={displayPfpUid} className={'h-10 rounded-full'}/>
            ) : (
                <img src = "/icons/default-pfp.svg" className = "h-10 rounded-full" />
            )}
            <h2 className="text-2xl text-white font-semibold">{displayName}</h2>
        </div>
    );
}