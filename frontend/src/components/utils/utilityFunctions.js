const getDisplayName = (conversations, activeConvUid, currUserUid) => {
    const openConvData = conversations?.find(conv => conv.conv_uid === activeConvUid);
    const displayName = openConvData?.members?.find(member => member.user_uid !== currUserUid)?.username;
    return displayName
}   

export {getDisplayName};