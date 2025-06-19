import MessageList from '@components/MessageList';
import MessageForm from './MessageForm';
import { useChatFeed, useResizeEl } from '@hooks';
import { PropsWithClassName } from '@types';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { DO_INTENT, INTENT_ACTIONS } from '@services/intents';

interface GraphicChatProps extends PropsWithClassName {
	hidden?: boolean;
}

const GraphicChat: React.FC<GraphicChatProps> = ({ className, hidden = false }) => {
	const feed = useChatFeed();
	const listRef = useRef<HTMLElement | null>(null);
	const [resizeList, setList] = useResizeEl();

	// === HELPERS ===
	function scrollY(
		{ top = listRef.current?.scrollHeight, behavior = 'instant' }: ScrollToOptions,
		by: boolean = false
	): void {
		if (hidden || !top) return;
		listRef.current?.[by ? 'scrollBy' : 'scrollTo']({ top, behavior });
	}

	useEffect(() => {
		setList(listRef.current!);
	}, []);

	useLayoutEffect(() => scrollY({ behavior: 'smooth' }), [feed]);

	useLayoutEffect(() => scrollY({ behavior: 'instant' }), [hidden]);

	useLayoutEffect(() => {
		if (resizeList.height > 0) return;
		console.log('SCROLL BY CHANGED HEIGHT', resizeList);
		scrollY({ behavior: 'instant', top: -resizeList.height }, true);
	}, [resizeList]);

	return (
		<article hidden={hidden} className={`h-full w-full flex flex-col ${className}`}>
			<section ref={listRef} className="overflow-y-scroll grow-1 shrink-1">
				<MessageList history={feed} />
			</section>
			<section className="shrink-0 h-15 box-border">
				{!hidden && (
					<MessageForm
						className="mt-auto shrink-0"
						onPush={() => DO_INTENT[INTENT_ACTIONS.SEND_MESSAGE]()}
					/>
				)}
			</section>
		</article>
	);
};

export default GraphicChat;
