import { FileContent } from "../ChatAreaComponents/FileContent";

export function MembersList({ members }) {

    return (
        <div className="flex flex-col text-white p-2 w-full">
            <h3 className="font-bold pb-2 text-xl">Group Members:</h3>
            <div className="pl-3 border-t border-b py-2 flex flex-col gap-1">
                {members.map((member, index) => (
                    <div className="flex p-1 gap-2 items-center">
                        {member.pfp_file_uid
                            ? <FileContent file_uid={member.pfp_file_uid} className={'h-8 rounded-full'} />
                            : <img src='/icons/default-pfp.svg' className="h-8" />}
                        <p className="font-bold">{member.username}</p>
                        {index == 0 && <p className="text-emerald-500 pl-2">(Admin)</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}