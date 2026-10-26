function FileUploadOptions({ handleFileChange }) {
    return (
        <div className="flex flex-col p-0! rounded! bottom-12.5 right-40 absolute bg-slate-800 z-3 w-[12%] *:flex *:hover:bg-slate-700 *:px-2 *:py-1">
            <label>
                <span>Document</span>
                <input onChange={handleFileChange}
                    id="file-doc-upload" type="file" accept=".pdf,.doc,.docx,.txt,.odt" className="hidden">
                </input>
            </label>
            <label>
                <span>Image</span>
                <input onChange={handleFileChange}
                    multiple
                    id="file-doc-upload" type="file" accept="image/*" className="hidden">
                </input>
            </label>
            <label>
                <span>Video</span>
                <input onChange={handleFileChange}
                    id="file-doc-upload" type="file" accept="video/*" className="hidden">
                </input>
            </label>
            <label>
                <span>Audio</span>
                <input onChange={handleFileChange}
                    id="file-doc-upload" type="file" accept="audio/*" className="hidden">
                </input>
            </label>

        </div>
    );
}

export { FileUploadOptions };