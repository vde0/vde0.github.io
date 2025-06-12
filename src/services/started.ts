import { requestLocalMedia, whenLocalMedia } from '@api/localMedia';
import { appAcessor } from './appAccessor';
import { intentChest } from './intents';

intentChest.once('startapp', () => {
	requestLocalMedia();
	whenLocalMedia(() => appAcessor.set('localmedia'));
});
