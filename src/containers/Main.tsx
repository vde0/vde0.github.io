/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import DisplayBox from '@components/DisplayBox';
import Controller from '@containers/Controller';
import VideoStream from './VideoStream';
import GraphicChat from './GraphicChat';
import { EmCss } from '@emotion/react'; // custom type
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { TWebApp } from '@tg-types'; // custom type
import { useEffect, useLayoutEffect, useState } from 'react';
import {
	useAppAccessor,
	useMobileKeyboard,
	useConnectionState,
	usePlatform,
	useUnread,
	useConnection,
} from '@hooks';
import { ChatCValue } from '@store/ChatProvider';
import { useStart } from 'hooks/useStart';
import Btn from '@components/Btn';
import { whenLocalMedia } from '@api/localMedia';
import { INTENT_ACTIONS, DO_INTENT } from '@services/intents';
import { ConnectionState, IConnection } from '@entities/Connection';
import { IRoom } from '@entities/Room';

const Main: React.FC = () => {
	const webApp: TWebApp = useWebApp();
	const connection: IConnection | null = useConnection();
	const connectionState: ConnectionState | null = useConnectionState();
	const keyboardStatus: boolean = useMobileKeyboard();
	const [, read]: ChatCValue['unread'] = useUnread();
	const platform = usePlatform();
	const [access] = useAppAccessor();

	const [isTextChatShown, setIsTextChatShown] = useState<boolean>(false);
	const [modal, setModal] = useState(0);

	const mainCss: EmCss = css`
		top: ${platform !== 'unknown' ? 'var(--tg-content-safe-area-inset-top)' : 0};
		bottom: ${platform !== 'unknown' ? 'var(--tg-content-safe-area-inset-bottom)' : 0};

		max-height: var(--tg-viewport-stable-height);
		overflow: clip;
	`;

	useStart(() => {
		setModal(-1);
		whenLocalMedia(() => setModal(1));
	});

	useLayoutEffect(() => {
		if (connectionState !== 'connected') setIsTextChatShown(false);
	}, [connectionState]);

	useEffect(() => {
		if (isTextChatShown) read(true);
		else read(false);
	}, [isTextChatShown]);

	return (
		<>
			<div className={`w-full fixed px-3 md:px-8 box-border`} css={mainCss}>
				<section
					className="
            container max-w-xl h-full
            relative mx-auto text-white
            flex flex-col
        "
				>
					<section
						className={`grow flex flex-col gap-10 pt-8 ${
							keyboardStatus ? 'pb-0' : 'pb-8'
						} absolute top-0 bottom-0 w-full`}
					>
						<DisplayBox className="flex items-center overflow-hidden shrink-0">
							<VideoStream remote />
						</DisplayBox>
						<DisplayBox className="flex items-center overflow-hidden">
							<GraphicChat hidden={!isTextChatShown} />
							<VideoStream remote={false} hidden={isTextChatShown} />
						</DisplayBox>
					</section>

					<div style={{ display: keyboardStatus ? 'none' : 'block' }} className="shrink-0 h-24">
						<Controller
							onNext={() => {
								if (connectionState !== 'connected') return;
								if (!connection) throw Error('`connection` is null or undefined');
								connection.close();
							}}
							onTextChat={() => {
								setIsTextChatShown(!isTextChatShown);
							}}
						/>
					</div>
				</section>
			</div>
			<div
				hidden={access}
				className="fixed w-full h-full bg-white/30 flex justify-center items-center flex-col"
			>
				<section
					hidden={modal !== 0}
					className="bg-gray text-white rounded-2xl p-4 h-[50%] w-[90%]"
				>
					<section className="w-full h-full flex flex-col justify-center">
						{// prettier-ignore
						}
						<p className="mb-2 mt-auto text-xl">
							Добро пожаловать в чат-рулетку! Чтобы начать, нажмите кнопку "Начать" и разрешите приложению доступ к Вашим пользовательским медиа
						</p>
						<Btn
							onClick={() => DO_INTENT[INTENT_ACTIONS.START_APP]}
							className="border-2 border-white rounded-2xl mt-auto"
						>
							<span className="font-bold uppercase">Начать</span>
						</Btn>
					</section>
				</section>
				<section
					hidden={modal !== 1}
					className="bg-gray text-white rounded-2xl p-4 h-[50%] w-[90%]"
				>
					<section className="w-full h-full flex flex-col justify-center">
						{// prettier-ignore
						}
						<p className="mb-2 text-xl">
							Приложение не смогло получить доступ к Вашим камере и микрофону, увы.
						</p>
						{// prettier-ignore
						}
						<p className="mb-2 text-xl">
							Чтобы попробовать ещё раз, перезагрузите страницу.
						</p>
					</section>
				</section>
			</div>
		</>
	);
};

export default Main;
