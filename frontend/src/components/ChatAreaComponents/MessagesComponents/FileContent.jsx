import axios from 'axios';
import { LOCAL_API_URL, HOSTED_API_URL } from '../../../URLs/endpoints';
import { useEffect, useState } from 'react';

export function FileContent({ file_uid }) {
    const [src, setSrc] = useState(null);
    let objectUrl = "";

    const handleFileFetch = async () => {
        try {
            const token = localStorage.getItem('xen_access_token');
            const response = await axios.get(`${LOCAL_API_URL}/file/get/${file_uid}`, {
                responseType: 'blob',
            })

            if (response.status >= 200 && response.status < 300) {
                objectUrl = URL.createObjectURL(response.data);
                setSrc(objectUrl);
            }
        } catch (error) {
            console.error('Error Fetching File:', error);
        }
    }

    useEffect(() => {

        handleFileFetch();

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        }
    }, [file_uid]);

    return (
        <img src={src} className='h-30 w-50'></img>
    );
}