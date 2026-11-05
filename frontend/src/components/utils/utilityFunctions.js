const getDisplayName = (conversations, activeConvUid, currUserUid) => {
    const openConvData = conversations?.find(conv => conv?.conv_uid === activeConvUid);

    if (openConvData?.conv_metadata?.conv_type === 'group') return openConvData?.conv_metadata?.conv_name;

    const displayName = openConvData?.members?.find(member => member?.user_uid !== currUserUid)?.username;
    return displayName;
}   

const getDisplayPfpUid = (conversations, activeConvUid, currUserUid) => {
    const openConvData = conversations?.find(conv => conv?.conv_uid === activeConvUid);

    if (openConvData?.conv_metadata?.conv_type === 'group') return null;

    const displayPfpUid = openConvData?.members?.find(member => member?.user_uid !== currUserUid)?.pfp_file_uid;
    return displayPfpUid;
}

const getAbout = (conversations, activeConvUid, currUserUid) => {
    const openConvData = conversations?.find(conv => conv?.conv_uid === activeConvUid);

    if (openConvData?.conv_metadata?.conv_type === 'group') return null;

    const about = openConvData?.members?.find(member => member?.user_uid !== currUserUid)?.about;
    return about; 
}

export {getDisplayName, getDisplayPfpUid, getAbout};