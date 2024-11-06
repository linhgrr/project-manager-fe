<template>
  <div class="chat-container">
    <div class="chat-box" ref="chatBox">
      <div
          v-for="message in messages"
          :key="message.id"
          :class="{ 'my-message': message.owner, 'other-message': !message.owner }"
      >
        <strong>{{ message.owner ? "Bạn" : `${message.fullName}` }}</strong>
        <p class="message-content">{{ message.content }}</p>
      </div>
    </div>
    <input
        v-model="message"
        @keyup.enter="sendMessage"
        placeholder="Nhập tin nhắn..."
        class="input-box"
    />
  </div>
</template>

<script>
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';

const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

export default {
  props: {
    projectId: Number,
  },
  data() {
    return {
      stompClient: null,
      messages: [],
      message: "",
      sender: "User",
    };
  },
  watch: {
    projectId: {
      immediate: true,
      handler: 'initComponent'
    }
  },
  async mounted() {
    await this.initComponent();
  },
  methods: {
    async initComponent() {
      await this.fetchPreviousMessages();
      this.scrollToBottom();

      if (!this.stompClient || !this.stompClient.connected) {
        this.connect();
      }
    },
    async fetchPreviousMessages() {
      try {
        const response = await axios.get(`http://localhost:8080/project/${this.projectId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.messages = response.data;
        for (let i = 0; i < this.messages.length; i++) {
          this.messages[i].owner = this.messages[i].senderId.toString() === userId.toString();
        }
      } catch (error) {
        console.error("Failed to fetch previous messages:", error);
      }
    },
    connect() {
      const socket = new SockJS('http://localhost:8080/ws');
      this.stompClient = Stomp.over(socket);

      this.stompClient.onConnect = () => {
        this.stompClient.subscribe(
            `/topic/project/${this.projectId}`,
            tick => {
              const message = JSON.parse(tick.body);
              message.owner = message.senderId.toString() === userId.toString();

              const messageExists = this.messages.some(
                  (msg) => msg.id === message.id
              );

              if (!messageExists) {
                this.messages.push(message);
                this.$nextTick(() => this.scrollToBottom());
              }
            },
            { Authorization: `Bearer ${token}` }
        );
      };

      this.stompClient.onStompError = (frame) => {
        console.error('STOMP error: ', frame);
      };

      this.stompClient.onDisconnect = () => {
        console.warn("Disconnected from WebSocket, attempting to reconnect...");
        setTimeout(() => {
          this.connect();
        }, 5000);
      };

      this.stompClient.activate();
    },
    sendMessage() {
      if (!this.stompClient || !this.stompClient.connected) {
        console.error("STOMP client is not connected.");
        return;
      }

      if (this.message.trim() !== "") {
        const chatMessage = {
          content: this.message,
          projectId: this.projectId,
          token: token,
          senderId: userId
        };
        this.stompClient.send(`/app/project/${this.projectId}/chat`, {}, JSON.stringify(chatMessage));
        this.message = "";
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatBox = this.$refs.chatBox;
        if (chatBox) {
          chatBox.scrollTop = chatBox.scrollHeight;
        }
      });
    }
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f0f2f5;
}

.chat-box {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.my-message {
  align-self: flex-end;
  background-color: #0084ff;
  color: #ffffff;
  border-radius: 18px 18px 0 18px;
  padding: 10px 15px;
  margin: 5px 0;
  max-width: 70%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.other-message {
  align-self: flex-start;
  background-color: #e4e6eb;
  color: #050505;
  border-radius: 18px 18px 18px 0;
  padding: 10px 15px;
  margin: 5px 0;
  max-width: 70%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.message-content {
  margin: 0;
}

.input-box {
  padding: 15px;
  border: none;
  border-top: 1px solid #ddd;
  outline: none;
  font-size: 16px;
  width: 100%;
}

.input-box::placeholder {
  color: #888;
}
</style>
