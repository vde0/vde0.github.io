import '@services/signal';
import '@services/peer';
import { INTENT_ACTIONS, intentChest } from './intents';
import { requestLocalMedia, whenLocalMedia } from '@api/localMedia';
import { ACC_FLAGS, appAcessor } from './appAccessor';
import { Session, SESSION_EVENTS } from '@entities/Session';
import { getWebApp } from '@lib/utils';

{
	intentChest.once(INTENT_ACTIONS.START_APP, () => {
		requestLocalMedia();
		whenLocalMedia((media) => media && appAcessor.set(ACC_FLAGS.LOCAL_MEDIA));
	});
}

{
	appAcessor.when(() => Session.findTarget());
	Session.on(SESSION_EVENTS.NEXT_TARGET, ({ connection }) => connection?.connect());
}

{
	const webApp = getWebApp();
	if (webApp)
		try {
			webApp.ready();
			webApp.lockOrientation?.();
			webApp.disableVerticalSwipes?.();
			webApp.requestFullscreen?.();
		} catch (err) {}
}
