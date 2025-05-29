interface MessageBlockProps {
    direction: 'left' | 'right';
    sender: string,
    text: string,
}

const MessageBlock: React.FC<MessageBlockProps> = ({ sender, text, direction }) => (
    <section className={`mb-2 p-2 rounded-2xl w-2/3 relative
        ${direction==="left"?"bg-gray rounded-bl-none left-2":"bg-light-blue rounded-br-none right-2 ml-auto"}`
    }>
        <span className={`block font-semibold ${direction==="left"?"text-light-blue":"text-orange"}`}>
            {sender}
        </span>
        <p className="text-white">{text}</p>
        <div className={`
            absolute w-0 h-0 bottom-0
            border-t-transparent border-3
            ${direction==="left"
                ?"border-gray border-l-transparent right-full"
                :"border-light-blue border-r-transparent left-full"
            }
        `}></div>
    </section>
);


export default MessageBlock