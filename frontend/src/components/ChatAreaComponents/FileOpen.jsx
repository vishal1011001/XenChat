import { FileContent } from "./FileContent";

export function FileOpen({ file_uid, closeFile }) {

    return (
        <div className="flex items-center text-white absolute p-4 pt-10 top-0 z-11 h-[92vh] w-[68.35vw] bg-slate-900 justify-center">
            <button onClick={() => closeFile()} className="absolute top-3 right-3 text-xl">ⓧ</button>
            <div className="flex justify-between w-full">
                <button >L</button>
                <FileContent file_uid={file_uid} />
                <button >R</button>
            </div>
        </div>
    );
}