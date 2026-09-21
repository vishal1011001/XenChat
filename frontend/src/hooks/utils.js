const markConversationReadLocally = (setConversations, convUid, readTime, currUserUid) => {
    setConversations(prev => prev.map(conv => {
        if (conv.conv_uid !== convUid) return conv;

        return {
            ...conv,
            members: conv.members.map(member => (
                (member.user_uid === currUserUid) ? { ...member, last_read_at: readTime } : member
            ))
        }
    }));
}

const updateLastMessage = (setConversations, message) => {
    setConversations(prev => prev.map(
        conv => {
            if (conv.conv_uid !== message.conv_uid) return conv;

            return {
                ...conv, last_message: message
            }
        }
    ))
}

export {markConversationReadLocally, updateLastMessage};