# Bouncer🚀

A simple multiple room manager for micro-WebSockets.

## General use case

- You're only able to spawn one process and you'd like to have an app with rooms.
- At the same time spawn X number of scalable microservices that can connect as websockets.

## Common use case

- Single process app server like a free `heroku.com` account or similar
- Building a chat
- Making node + javascript games

## Installation

It's hosted as an `npm` package so installation is of course as simple as:

```bash
yarn add @jacekpietal/bouncer.js --save
```

## Chat [full working app] example:

### Node.js part:

```javascript
const bouncerJs = require("@jacekpietal/bouncer");

const { broadcast } = bouncerJs({
  debug: true,
  plugins: { chat },
});

/**
 * @param {WebSocket} ws
 * @param {object} message
 */
function chat(ws, { id, event, data }) {
  switch (event) {
    case "say":
      // broadcast to all sockets inside chat topic
      broadcast("chat", { id, event, data });
      break;
  }
}

// "bouncer🚀 started"
// "bouncer🚀 listens @ 1337"
```

### Frontend part:

```javascript
const socket = new WebSocket("ws://localhost:1337");

socket.onopen = (value) => {
  socket.send(JSON.stringify({ event: "/join", data: "chat" }));
};

socket.onmessage = ({ data: string }) => {
  const { id, event, data } = JSON.parse(string);

  console.log({ id, event, data });
};
```

### To above example you can run:

```bash
yarn test:chat
```

And visit `http://localhost:8080` in your favourite Chrome browser or other.

## Configuration

see [config.js](https://github.com/Prozi/bouncer.js/blob/master/config.js)

---

To see complimentary RAW frontend of above chat (`index.html` - working)

see [index.html](https://github.com/Prozi/bouncer.js/blob/master/index.html)

---

## License

MIT

- Do what you want, fork, etc.
- I am not responsible for any problem this free application causes :P

have fun, please open any issues, etc.

- Jacek Pietal
