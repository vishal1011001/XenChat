const getConvMetadata = (conversations, activeConvUid) => {
    const openConvData = conversations?.find(conv => conv?.conv_uid === activeConvUid);
    return openConvData;
}

const getDisplayName = (openConvData, currUserUid) => {
    if (openConvData?.conv_metadata?.conv_type === 'group') return openConvData?.conv_metadata?.conv_name;

    const displayName = openConvData?.members?.find(member => member?.user_uid !== currUserUid)?.username;
    return displayName;
}   

const getDisplayPfpUid = (openConvData, currUserUid) => {
    if (openConvData?.conv_metadata?.conv_type === 'group') return null;

    const displayPfpUid = openConvData?.members?.find(member => member?.user_uid !== currUserUid)?.pfp_file_uid;
    return displayPfpUid;
}

const getAbout = (openConvData, currUserUid) => {
    if (openConvData?.conv_metadata?.conv_type === 'group') return null;

    const about = openConvData?.members?.find(member => member?.user_uid !== currUserUid)?.about;
    return about; 
}

export {getConvMetadata, getDisplayName, getDisplayPfpUid, getAbout};