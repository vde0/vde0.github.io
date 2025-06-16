const EVENT_ATOM = {
	ICE: 'ice',
	SDP: 'sdp',
	TARGET: 'target',
};
Object.freeze(EVENT_ATOM);
const DATA_NAME = {
	[EVENT_ATOM.ICE]: 'ice',
	[EVENT_ATOM.SDP]: 'sdp',
	[EVENT_ATOM.TARGET]: 'offer',
};
Object.freeze(DATA_NAME);
export const ACTIONS = {
	get RELAY_SDP() {
		return this.getRelay(EVENT_ATOM.SDP);
	},
	get RELAY_ICE() {
		return this.getRelay(EVENT_ATOM.ICE);
	},
	get RELAY_TARGET() {
		return this.getRelay(EVENT_ATOM.TARGET);
	},

	get ACCEPT_SDP() {
		return this.getAccept(EVENT_ATOM.SDP);
	},
	get ACCEPT_ICE() {
		return this.getAccept(EVENT_ATOM.ICE);
	},
	get ACCEPT_TARGET() {
		return this.getAccept(EVENT_ATOM.TARGET);
	},

	getRelay(atom) {
		return `relay${atom}`;
	},
	getAccept(atom) {
		return `accept${atom}`;
	},
};

Object.freeze(EVENT_ATOM);
Object.freeze(DATA_NAME);
Object.freeze(ACTIONS);
