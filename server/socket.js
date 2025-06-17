const { EventEmitter } = require('events');
const { SIGNAL_ACTIONS, SIGNAL_DATA_NAME, SIGNAL_ACTION_ATOM } = require('../src/api/socket-api');

const DISCONNECT_DELAY = 10000;
const CONNECTION_LOOP_DELAY = 500;

module.exports = async function SocketIo(server) {
	// === DATA ===
	const io = require('socket.io')(server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
		},
	});

	const freeSockets = new Map();
	const getSocket = (socketId) => io.of('/').sockets.get(socketId);

	// dev
	const emitterMap = new Map();

	// === CONNECTION LOOP ===
	setInterval(makeConnect, CONNECTION_LOOP_DELAY);

	// === SERVICES ===
	function wait(userId, socketId) {
		freeSockets.set(userId, socketId);
	}
	function dewait(userId) {
		freeSockets.delete(userId);
	}

	function makeConnect() {
		if (freeSockets.size < 2) return;

		let userCount = 2;
		const users = [];

		const ids = freeSockets.keys();
		while (userCount > 0) {
			const { value: userId } = ids.next();

			if (!userId) throw Error(`At the 'makeConnect()' socket '${userId}' is not found`);

			users.push(userId);
			userCount--;
		}

		console.log('RELAY TARGET');
		relay(users[0], users[1], SIGNAL_ACTION_ATOM.TARGET, true);
		relay(users[1], users[0], SIGNAL_ACTION_ATOM.TARGET, false);
		freeSockets.delete(users[0]);
		freeSockets.delete(users[1]);
	}

	// === HELPERS ===
	function relay(senderId, targetId, atom, data) {
		console.log(`relay ${senderId} -> ${targetId}`);

		const senderSocket = getSocket(freeSockets.get(senderId));
		const targetSocket = getSocket(freeSockets.get(targetId));
		if (!senderSocket) {
			console.warn('Failed to find the Sender Socket.');
			return;
		}
		if (!targetSocket) {
			console.warn('Failed to find the Target Socket.');
			return;
		}

		const [acceptWay, dataName] = defineAcceptState(atom);
		targetSocket.emit(acceptWay, { target: senderId, [dataName]: data });

		// dev
		emitterMap.get(targetSocket.id)?.emit(acceptWay, { target: senderId, [dataName]: data });
	}
	function defineAcceptState(atom) {
		return [SIGNAL_ACTIONS.getAccept(atom), SIGNAL_DATA_NAME[atom]];
	}

	// === SOCKET LISTENING ===
	io.on('connection', (socket) => {
		console.log('connect', socket.id);

		// === DATA ===
		let successTimerId;
		let dataRelayed = false;
		let dataAccepted = false;

		let userId = null;

		// === SUBSCRIBE SOCKET FOR LOCAL EMITTER
		const socketEmitter = new EventEmitter();
		const on = socketEmitter.on.bind(socketEmitter);
		emitterMap.set(socket.id, socketEmitter);

		// === HELPERS ===
		function checkForDisconnect(delay) {
			clearTimeout(successTimerId);

			if (!dataRelayed && !dataAccepted) return;
			successTimerId = setTimeout((_) => disconnect(), delay);
		}

		function setUserId(id) {
			userId = id;
			wait(userId, socket.id);
		}

		function disconnect() {
			socket.disconnect();
		}

		// === LISTENERS ===
		function disconnectHandler() {
			console.log('DISCONNECT');
			emitterMap.delete(socket.id);
			dewait(userId);
		}

		function relayTargetHandler({ target: userId }) {
			console.log('RELAY_TARGET');
			setUserId(userId);
		}

		function relayIceHandler({ target: targetId, ice }) {
			console.log('RELAY_ICE');
			relay(userId, targetId, SIGNAL_ACTION_ATOM.ICE, ice);
			checkForDisconnect(DISCONNECT_DELAY);
		}

		function relaySdpHandler({ target: targetId, sdp }) {
			console.log('RELAY_SDP');
			relay(userId, targetId, SIGNAL_ACTION_ATOM.SDP, sdp);
			dataRelayed = true;
		}

		function acceptTargetHandler(_) {
			console.log('ACCEPT_TARGET');
		}

		function acceptIceHandler(_) {
			console.log('ACCEPT_ICE');
		}

		function acceptSdpHandler(_) {
			console.log('ACCEPT_SDP');
			dataAccepted = true;
		}

		// === LISTEN GENERAL ===
		socket.on('disconnect', disconnectHandler);

		// === LISTEN RELAY ===
		socket.on(SIGNAL_ACTIONS.RELAY_TARGET, relayTargetHandler);
		socket.on(SIGNAL_ACTIONS.RELAY_ICE, relayIceHandler);
		socket.on(SIGNAL_ACTIONS.RELAY_SDP, relaySdpHandler);

		// === LISTEN ACCEPT ===
		on(SIGNAL_ACTIONS.ACCEPT_TARGET, acceptTargetHandler);
		on(SIGNAL_ACTIONS.ACCEPT_ICE, acceptIceHandler);
		on(SIGNAL_ACTIONS.ACCEPT_SDP, acceptSdpHandler);
	});

	return io;
};
