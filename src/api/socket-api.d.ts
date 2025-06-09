declare module '@api/socket-api' {
	export const ACTIONS: {
		SUCCESS: 'success';
		RELAY_SDP: 'relaysdp';
		RELAY_ICE: 'relayice';
		RELAY_TARGET: 'relaytarget';
		ACCEPT_SDP: 'acceptsdp';
		ACCEPT_ICE: 'acceptice';
		ACCEPT_TARGET: 'accepttarget';
	};
}
