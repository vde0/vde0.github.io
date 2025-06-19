import '@services/signal';
import '@services/peer';
import { DO_INTENT, INTENT_ACTIONS, intentChest } from './intents';
import { requestLocalMedia, whenLocalMedia } from '@api/localMedia';
import { ACC_FLAGS, appAcessor } from './appAccessor';
import { Session, SESSION_EVENTS } from '@entities/Session';
import { getWebApp } from '@lib/utils';
import { USER_EVENTS } from '@entities/User';
import { Profile } from '@entities/Profile';

// == INTENT LISTENERS ==
// START_APP
{
	appAcessor.when(() => {
		DO_INTENT[INTENT_ACTIONS.NEXT]();
	});

	intentChest.once(INTENT_ACTIONS.START_APP, () => {
		requestLocalMedia();
		whenLocalMedia((media) => {
			console.log('INIT LISTENER CLIENT MEDIA');
			// Session.room
			// 	.getUser(Session.client)!
			// 	.once(USER_EVENTS.MEDIA, () => console.log('CLIENT MEDIA'));
			Profile.user.setMedia(media);
			appAcessor.set(ACC_FLAGS.LOCAL_MEDIA);
		});
	});
}

// NEXT
{
	intentChest.on(INTENT_ACTIONS.NEXT, () => {
		console.log('NEXT');
		Profile.updateRoom();
		Session.next();
	});
}

// == CONFIG WEB APP
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
