import mqtt from 'mqtt';
import { Server } from 'socket.io';
import http from 'http';

// MQTT Config
const mqttClient = mqtt.connect('mqtt://broker.emqx.io');
const server = http.createServer();
const io = new Server(server, { cors: { origin: '*' } });

// Subscribe to all devices
mqttClient.on('connect', () => {
  mqttClient.subscribe('openpin/+/fromDevice');
  console.log('✅ Connected to EMQX');
});

// Relay MQTT → Socket.IO
mqttClient.on('message', (topic, msg) => {
  const [ , token, dir ] = topic.split('/');
  if (dir !== 'fromDevice') return;

  try {
    const data = JSON.parse(msg.toString());
    console.log(data)
    io.to(token).emit('message', { pin: data.pin, value: data.value });
    console.log(`[MQTT → WS] ${token} ${data.pin} = ${data.value}`);
  } catch (e) {
    console.error('Failed to parse MQTT message:', e);
  }
});

// Handle incoming socket clients
io.on('connection', socket => {
  console.log('🔌 Web client connected');

  socket.on('register', ({ token }) => {
    socket.join(token);
    console.log(`📦 Joined room: ${token}`);
  });

  socket.on('control', ({ token, pin, value }) => {
    const topic = `openpin/${token}/toDevice`;
    const payload = JSON.stringify({ pin, value });
    mqttClient.publish(topic, payload);
    console.log(`[WS → MQTT] ${token} ${pin} = ${value}`);
  });
});

server.listen(3000, () => console.log('🧠 OpenPin bridge running on :3000'));
