import { SignalActionMap } from '@api/socket-api';
import { IListenerChest, ListenerChest } from '@lib/pprinter-tools';

export interface ISignal extends IListenerChest<SignalActionMap> {}
export const Signal: ISignal = new ListenerChest();
