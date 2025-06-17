import { EventKeys } from '@lib/pprinter-tools';
import { LowercaseMap } from '@types';

declare module '@api/socket-api' {
	export type OrigSignalActionMap = {
		acceptIce: { target: string; ice: RTCIceCandidate | null };
		acceptSdp: { target: string; sdp: RTCSessionDescription | RTCSessionDescriptionInit };
		acceptTarget: { target: string; offer: boolean };
		relayIce: { target: string; ice: RTCIceCandidate | null };
		relaySdp: { target: string; sdp: RTCSessionDescription | RTCSessionDescriptionInit };
		relayTarget: { target: string };
	};
	export type SignalActionMap = LowercaseMap<OrigSignalActionMap>;
	export type SignalAction = keyof SignalActionMap;

	export const SIGNAL_ACTIONS: EventKeys<keyof OrigSignalActionMap>;
}
