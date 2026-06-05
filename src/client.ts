/// <reference lib="dom" />

export function counterClient() {
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const socket = new WebSocket(protocol + '//' + window.location.host);
	const counter = document.getElementById('counter');

	socket.onmessage = (event) => {
		if (counter) counter.innerText = event.data;
	};

	const button = document.getElementById('clickBtn');
	if (button) button.onclick = () => socket.send('increment');
}
