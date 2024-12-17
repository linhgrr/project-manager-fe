<template>
  <div class="chat-container">
    <div class="chat-box" ref="chatBox">
      <div
          v-for="message in messages"
          :key="message.id"
          :class="{ 'my-message': message.owner, 'other-message': !message.owner }"
      >
        <!-- Nếu là tin nhắn của đối phương, hiển thị avatar và tên ở trên -->
        <div v-if="!message.owner" class="message-header">
          <span :class="{ 'rainbow-text': message.subscribed }">{{ message.fullName }}</span>
        </div>
        <!-- Nội dung tin nhắn -->
        <div style="display: flex; align-items: center">
          <img v-if="message.pictureUrl && !message.owner" :src="message.pictureUrl" alt="Avatar" class="avatar" />
          <p class="message-content">{{ message.content }}</p>
        </div>
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
  margin: 5px 0;
  font-size: 15px;
  max-width: 70%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.other-message {
  max-width: 70%;
  margin: 10px 0;
}

.message-header {
  flex-direction: column;
  margin-left: 55px;
  margin-bottom: 5px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.other-message .message-content {
  background-color: #e4e6eb;
  color: #050505;
  border-radius: 18px;

  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.message-content {
  padding: 10px 15px;
  margin: 0;
  font-size: 15px;
}

.rainbow-text {
  font-size: 14px;
  font-weight: 600;
  color: #555;
  background-image: linear-gradient(90deg, #ff7e5f, #feb47b, #ffdd67, #a1ffce, #6dd5ed, #a1c4fd);
  background-size: 200% 100%;
  animation: rainbow-animation 3s linear infinite;
  -webkit-background-clip: text;
  color: transparent;
}

@keyframes rainbow-animation {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
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



