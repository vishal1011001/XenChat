import { useEffect, useState } from "react";
import { PfpPreview } from "./ProfileComponents/PfpPreview";
import axios from "axios";
import { FileContent } from "../ChatAreaComponents/FileContent";

export function Profile({ API_URL, setSelectedWindow }) {
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('xen_user_data')));

    const [selectedPfp, setSelectedPfp] = useState(null);
    const [pfpPreviewUrl, setPfpPreviewUrl] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const selectPfp = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedPfp(file);
        setPfpPreviewUrl(URL.createObjectURL(file));
        setShowCropper(true);
    };

    const handleCropDone = async (croppedFile) => {
        const previewUrl = URL.createObjectURL(croppedFile);
        setPfpPreviewUrl(previewUrl);
        setShowCropper(false);

        const formData = new FormData();
        formData.append("file", croppedFile);

        try {
            const token = localStorage.getItem("xen_access_token");
            const response = await axios.post(`${API_URL}/file/pfp`, formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            });

            if (response.status >= 200 && response.status < 300) {
                const result = response.data;

                const updatedUserData = {
                    ...userData,
                    pfp_file_uid: result.pfp_file_uid
                };

                setUserData(updatedUserData);
                localStorage.setItem('xen_user_data', JSON.stringify(updatedUserData));
                console.log('pfp updated:', result);
            } 
        } catch (error) {
            console.error("error uploading pfp:", error);
        }
    };

    useEffect(() => {
      return () => {
        if (pfpPreviewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(pfpPreviewUrl);
        }
      };
    }, [pfpPreviewUrl]);

    return (
        <div className="h-screen w-full bg-slate-900 p-4 text-white">
            <div className="relative mx-auto w-fit">
                {userData?.pfp_file_uid ? (
                    <div className="rounded-full h-50 w-50">
                        <FileContent file_uid={userData?.pfp_file_uid} 
                          className={'rounded-full h-50 w-50'}
                        />
                    </div>
                  ) : (
                    <img
                        src="/icons/default-pfp.svg"
                        className="h-50 w-50 rounded-full object-cover"
                    />
                  )}

                <label className="absolute bottom-3 right-2 rounded-full bg-red-700 p-2 hover:bg-red-500">
                    <img src="/icons/camera.svg" className="h-8 invert" />
                    <input onChange={selectPfp} type="file" accept="image/*" className="hidden" />
                </label>
            </div>

            {showCropper && pfpPreviewUrl && (
              <PfpPreview imageSrc={pfpPreviewUrl} onCropComplete={handleCropDone} />
            )}
        </div>
    );
}