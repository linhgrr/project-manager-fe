<template>
  <div class="chat-container">
    <div class="chat-box" ref="chatBox">
      <div
          v-for="message in messages"
          :key="message.id"
          :class="{ 'my-message': message.owner, 'other-message': !message.owner }"
      >
        <strong>{{ message.owner ? "You" : `${message.fullName}` }}</strong>
        <p class="message-content">{{ message.content }}</p>
      </div>
    </div>
    <input
        v-model="message"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
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

      // Kiểm tra stompClient trước khi kết nối để tránh kết nối nhiều lần
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
        console.log("Connected to WebSocket");

        this.stompClient.subscribe(
            `/topic/project/${this.projectId}`,
            tick => {
              const message = JSON.parse(tick.body);
              message.owner = message.senderId.toString() === userId.toString();

              // Kiểm tra nếu message chưa tồn tại trước khi thêm vào để tránh lặp
              const messageExists = this.messages.some(
                  (msg) => msg.id === message.id
              );

              if (!messageExists) {
                console.log("Push ne");
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
          senderId: userId // Thêm senderId để xác định người gửi
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
  max-height: calc(100vh - 280px);
  min-height: calc(100vh - 280px);
  height: 100%;
  background-color: #f9f9f9;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

.chat-box {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}


.my-message {
  align-self: flex-end;
  background-color: #000000;
  color: #ffffff;
  border-radius: 8px;
  padding: 8px;
  margin: 5px 0;
  max-width: 70%;
}

.other-message {
  align-self: flex-start;
  background-color: #e0e0e0;
  color: #000000;
  border-radius: 8px;
  padding: 8px;
  margin: 5px 0;
  max-width: 70%;
}

.message-content {
  margin: 0;
}

.input-box {
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  outline: none;
}
</style>
