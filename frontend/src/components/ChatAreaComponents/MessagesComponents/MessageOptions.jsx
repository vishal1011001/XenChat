export function MessageOptions({ message, deleteMessage, changeEditingState }) {
    return (
        <div className="absolute -left-33 top-9 z-2 bg-gray-800 text-white rounded p-0.5
                                            *:p-0.5 *:hover:bg-gray-600 *:active:bg-gray-700 *:w-full *:gap-1.5">
            <button
                className="flex flex-row! "
            ><img src='/info.png' className="h-4 invert-100 place-self-center" /> Message Info</button>

            <button className="flex flex-row!"
            ><img src='/forward-message.png' className="h-4 invert-100 place-self-center" /> Forward</button>

            <button
                onClick={() => changeEditingState(message.message_uid, message.content)}
                className="flex flex-row!"
            ><img src='/pencil.png' className="h-4 invert-100 place-self-center" /> Edit</button>

            <button className="flex flex-row!"
            ><img src='/reply-message.png' className="h-5 invert-100 place-self-center" /> Reply</button>

            <button
                onClick={deleteMessage}
                className="flex flex-row! border-t hover:bg-red-950!"
            ><img src='/delete.png' className="h-5 place-self-center" /> Delete</button>
        </div>
    );
}