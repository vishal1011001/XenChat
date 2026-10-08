const getDisplayName = (conversations, activeConvUid, currUserUid) => {
    const openConvData = conversations?.find(conv => conv?.conv_uid === activeConvUid);

    if (openConvData?.conv_metadata?.conv_type === 'group') return openConvData?.conv_metadata?.conv_name;

    const displayName = openConvData?.members?.find(member => member?.user_uid !== currUserUid)?.username;
    return displayName;
}   

export {getDisplayName};