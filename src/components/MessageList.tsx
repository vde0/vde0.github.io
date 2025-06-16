/** @jsxImportSource @emotion/react */
import { css, EmCss } from '@emotion/react';
import MessageBlock from './MessageBlock';
import { forwardRef, useEffect, useRef } from 'react';
import { MsgItem } from '@entities/Chat';
import { useClientId } from '@hooks';

interface MessageListProps {
	history: MsgItem[];
}

const msgListCss: EmCss = css``;

const MessageList = forwardRef<HTMLElement, MessageListProps>(({ history }, ref) => {
	const listRef = useRef<HTMLUListElement | null>(null);
	const client = useClientId();

	useEffect(() => {
		if (ref) {
			if (typeof ref === 'function') ref(listRef.current);
			else ref.current = listRef.current;
		}
	}, []);

	return (
		<ul ref={listRef} css={msgListCss} className="px-2">
			{history.map((sMsgItem, index) => {
				const [sender, direction] =
					sMsgItem.userId === client
						? ['Вы', 'right' as 'right']
						: ['Собеседник', 'left' as 'left'];
				return (
					<li className={`${index === history.length - 1 ? 'mb-0' : 'mb-2'}`}>
						<MessageBlock sender={sender} text={sMsgItem.text} direction={direction} key={index} />
					</li>
				);
			})}
		</ul>
	);
});

export default MessageList;
