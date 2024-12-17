<template>
  <div class="payment-result">
    <div class="icon-container animate-icon" :class="{'success-icon': isSuccess, 'error-icon': !isSuccess}">
      <!-- Icon dấu check xanh khi thành công, dấu x đỏ khi thất bại -->
      <svg v-if="isSuccess" xmlns="http://www.w3.org/2000/svg" class="icon icon-check" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17l-3.88-3.88a1 1 0 10-1.41 1.41l4.59 4.59a1 1 0 001.41 0l9.59-9.59a1 1 0 00-1.41-1.41L9 16.17z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="icon icon-error" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M15 9l-1.41-1.41L12 10.17 10.41 8.59 9 10l2 2-2 2 1.41 1.41L12 13.83l1.59 1.59L15 14l-2-2 2-2z"/>
      </svg>
    </div>
    <h2 class="payment-title animate-fade-in">{{ title }}</h2>
    <p class="payment-message animate-fade-in">{{ message }}</p>
    <p v-if="isSuccess" class="payment-thanks animate-fade-in">Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!</p>
    <!-- Nút quay lại trang chủ -->
    <button @click="goBack" class="back-button">Quay về trang chủ</button>
  </div>
</template>

<script>
import axios from 'axios';
const token = localStorage.getItem('token');

export default {
  data() {
    return {
      isSuccess: false,
      title: '',
      message: ''
    };
  },
  created() {
    const params = this.$route.query;
    axios.get('http://localhost:8080/api/payment/verify', {
      params,
      headers: {Authorization: `Bearer ${token}`}
    })
        .then(response => {
          this.message = response.data.message || 'Không xác định kết quả giao dịch.';

          // Kiểm tra thông báo để xác định trạng thái thanh toán
          if (this.message.toLowerCase().includes('không thành công')) {

            this.isSuccess = false;
            this.title = 'Thanh toán thất bại';
          } else {
            this.isSuccess = true;
            this.title = 'Thanh toán thành công!';
          }
        })
        .catch(error => {
          console.error('Error:', error);
          this.isSuccess = false;
          this.title = 'Thanh toán thất bại';
          this.message = 'Có lỗi xảy ra trong quá trình xác thực thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.';
        });

    // Tự động chuyển về trang chủ sau 4 giây
    setTimeout(() => {
      this.$router.push('/');
    }, 4000);
  },
  methods: {
    goBack() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
/* Container chính */
.payment-result {
  font-family: "Space Grotesk", serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f9ff;
  padding: 20px;
  text-align: center;
}

/* Icon Container */
.icon-container {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 20px;
}

.success-icon {
  background-color: #4caf50;
  color: white;
}

.error-icon {
  background-color: #f44336;
  color: white;
}

/* Icon Size */
.icon-check,
.icon-error {
  width: 48px;
  height: 48px;
}

/* Hoạt ảnh xuất hiện cho icon */
@keyframes scaleUp {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-icon {
  animation: scaleUp 0.6s ease-out;
}

/* Hoạt ảnh xuất hiện cho văn bản */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-in-out;
}

/* Tiêu đề */
.payment-title {
  font-size: 28px;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 12px;
}

.payment-title.error {
  color: #f44336;
}

/* Thông báo chính */
.payment-message {
  font-size: 18px;
  color: #333333;
  max-width: 600px;
  margin-bottom: 12px;
}

/* Thông báo cảm ơn */
.payment-thanks {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 24px;
}

/* Nút Quay về trang chủ */
.back-button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background-color: #3b82f6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #2563eb;
}
</style>
