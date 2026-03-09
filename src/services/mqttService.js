import mqtt from 'mqtt';

const MQTT_TOPICS = {
  VIBRATION: 'sensor/vibration',
  TEMPERATURE: 'sensor/temperature',
  HUMIDITY: 'sensor/humidity',
  SOUND: 'sensor/sound',
  MAGNETIC: 'sensor/magnetic',
  STATUS: 'device/status',
  ALL: 'sensor/#',
};

class MQTTService {
  constructor() {
    this.client = null;
    this.listeners = new Map();
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  connect(brokerUrl = 'ws://localhost:9001/mqtt', options = {}) {
    const defaultOptions = {
      clientId: `vibrationguard_${Math.random().toString(16).slice(2, 10)}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 3000,
      ...options,
    };

    this.client = mqtt.connect(brokerUrl, defaultOptions);

    this.client.on('connect', () => {
      console.log('[MQTT] Connected to broker');
      this.connected = true;
      this.reconnectAttempts = 0;
      this.client.subscribe(MQTT_TOPICS.ALL, { qos: 1 });
      this._notify('connection', { connected: true });
    });

    this.client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        this._notify(topic, data);
        this._notify('any', { topic, data });
      } catch {
        console.warn('[MQTT] Invalid message on', topic);
      }
    });

    this.client.on('error', (err) => {
      console.error('[MQTT] Error:', err.message);
      this._notify('error', { error: err.message });
    });

    this.client.on('close', () => {
      this.connected = false;
      this._notify('connection', { connected: false });
    });

    this.client.on('reconnect', () => {
      this.reconnectAttempts++;
      console.log(`[MQTT] Reconnecting... attempt ${this.reconnectAttempts}`);
    });

    return this;
  }

  subscribe(topic, callback) {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set());
    }
    this.listeners.get(topic).add(callback);

    return () => {
      const topicListeners = this.listeners.get(topic);
      if (topicListeners) {
        topicListeners.delete(callback);
      }
    };
  }

  publish(topic, data) {
    if (this.client && this.connected) {
      this.client.publish(topic, JSON.stringify(data), { qos: 1 });
    }
  }

  _notify(topic, data) {
    const topicListeners = this.listeners.get(topic);
    if (topicListeners) {
      topicListeners.forEach((cb) => cb(data));
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.connected = false;
    }
  }

  isConnected() {
    return this.connected;
  }
}

export const mqttService = new MQTTService();
export { MQTT_TOPICS };
export default mqttService;
