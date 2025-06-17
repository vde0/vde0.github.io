export const SIGNAL_ACTION_ATOM = {
	ICE: 'ice',
	SDP: 'sdp',
	TARGET: 'target',
};

export const SIGNAL_DATA_NAME = {
	[SIGNAL_ACTION_ATOM.ICE]: 'ice',
	[SIGNAL_ACTION_ATOM.SDP]: 'sdp',
	[SIGNAL_ACTION_ATOM.TARGET]: 'offer',
};

export const SIGNAL_ACTIONS = {
	get RELAY_SDP() {
		return this.getRelay(SIGNAL_ACTION_ATOM.SDP);
	},
	get RELAY_ICE() {
		return this.getRelay(SIGNAL_ACTION_ATOM.ICE);
	},
	get RELAY_TARGET() {
		return this.getRelay(SIGNAL_ACTION_ATOM.TARGET);
	},

	get ACCEPT_SDP() {
		return this.getAccept(SIGNAL_ACTION_ATOM.SDP);
	},
	get ACCEPT_ICE() {
		return this.getAccept(SIGNAL_ACTION_ATOM.ICE);
	},
	get ACCEPT_TARGET() {
		return this.getAccept(SIGNAL_ACTION_ATOM.TARGET);
	},

	getRelay(atom) {
		return `relay${atom}`;
	},
	getAccept(atom) {
		return `accept${atom}`;
	},
};

Object.freeze(SIGNAL_ACTION_ATOM);
Object.freeze(SIGNAL_DATA_NAME);
Object.freeze(SIGNAL_ACTIONS);
