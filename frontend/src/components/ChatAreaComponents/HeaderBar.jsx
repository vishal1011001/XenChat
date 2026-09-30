export function HeaderBar({ isChatMetadataOpen, conversations, activeConvUid, currUserUid}) {
    const displayName = conversations.map(conversation => {
        if (conversation.conv_uid === activeConvUid) {
            return conversation.members.map(member => {
                if (member.user_uid !== currUserUid) return member?.username;
            })
        }
    })

    return (
        <div className="h-18 w-6xl bg-slate-900 border-l border-white flex flex-row pl-6 gap-2 items-center z-2 fixed top-0" >
            <img src="/default-pfp.png" className="h-10 rounded-full" />
            <h2 className="text-2xl text-white font-semibold">{displayName}</h2>
        </div>
    );
}