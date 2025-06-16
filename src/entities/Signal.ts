import { ActionMap } from '@api/socket-api';
import { IListenerChest, ListenerChest } from '@lib/pprinter-tools';

export interface ISignal extends IListenerChest<ActionMap> {}
export const Signal: ISignal = new ListenerChest();
