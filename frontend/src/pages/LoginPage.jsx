export default function LoginPage() {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-linear-90 from-stone-700 to-stone-600">
            <div className="flex flex-row items-center pl-5 pr-5 w-[60vw] h-[80vh] bg-white rounded-xl">
                <div className="w-[50%] h-full flex flex-col items-center justify-center p-4 pt-0">
                    <h3 className="text-3xl mb-10 font-serif">Sign In</h3>

                    <form className="flex flex-col items-center justify-center gap-2">
                        <input placeholder="Email" className="p-3 bg-gray-200 rounded w-100 focus:outline-1 outline-stone-800" />
                        <input placeholder="password" className="p-3 bg-gray-200 rounded w-100 outline-0 focus-within:shadow-md shadow-orange-200" />

                        <p className="my-3">New User? Sign Up</p>

                        <button className="bg-orange-600 p-3 w-full rounded text-white font-bold">Login</button>

                        <div className="flex flex-row w-full items-center my-4">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="mx-2 text-gray-700">or continue with</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        <div className="flex flex-row gap-3 *:hover:bg-gray-300 *:p-2 *:rounded-full">
                            <button><img src="/google-logo.png" className="h-6 w-6" /></button>
                            <button><img src="/microsoft-logo.png" className="h-6 w-6" /></button>
                        </div>
                    </form>

                </div>
                <div className="h-[95%] w-[50%]">
                    <img src="/login-bg1.jpg" className="rounded-xl h-full w-full" />
                </div>
            </div>
        </div>
    );
}