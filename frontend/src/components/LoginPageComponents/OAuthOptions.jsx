export function OAuthOptions() {
    return (
        <>
            <div className="flex flex-row w-full items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="mx-2 text-gray-700">or continue with</span>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="flex flex-row gap-3 *:hover:bg-gray-300 *:p-2 *:rounded-full">
                <button><img src="/google-logo.png" className="h-6 w-6" /></button>
                <button><img src="/microsoft-logo.png" className="h-6 w-6" /></button>
            </div>
        </>
    );
}