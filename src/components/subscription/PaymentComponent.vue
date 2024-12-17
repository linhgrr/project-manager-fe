<template>
  <div class="pricing-section" style="min-height: 100vh">
    <!-- Nút Quay về -->
    <button @click="goBack" class="back-button">Quay về</button>

    <h2 class="pricing-title">Ready to get started?</h2>
    <p class="pricing-subtitle">14 days unlimited free trial. No contract or credit card required.</p>

    <div class="pricing-cards" style="margin-top: 40px;">
      <!-- Free Plan -->
      <div class="pricing-card free-plan">
        <h3 class="plan-title">Free Plan</h3>
        <p class="plan-price">Miễn phí</p>
        <ul class="plan-features">
          <li>Tạo tối đa 2 dự án</li>
          <li>Hỗ trợ cơ bản</li>
        </ul>
        <button class="cta-button" disabled>Đã đăng ký</button>
      </div>

      <!-- VIP Plan -->
      <div class="pricing-card vip-plan highlighted">
        <h3 class="plan-title">VIP Plan</h3>
        <p class="plan-price">50,000 VND</p>
        <ul class="plan-features">
          <li>Dự án không giới hạn</li>
          <li>Tên cầu vồng</li>
          <li>Hỗ trợ ưu tiên</li>
          <li>Truy cập tính năng đặc biệt</li>
        </ul>
        <button @click="makePayment" class="cta-button">Đăng ký VIP</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const token = localStorage.getItem('token');

export default {
  methods: {
    makePayment() {
      // Gọi API để tạo URL thanh toán
      axios.get('http://localhost:8080/api/payment/create', {
        headers: { Authorization: `Bearer ${token}` }
      })
          .then(response => {
            // Chuyển hướng người dùng đến URL thanh toán
            window.location.href = response.data.paymentUrl;
          })
          .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.');
          });
    },
    goBack() {
      // Chuyển hướng về trang chủ
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
/* General Styles */
.pricing-section {
  font-family: "Space Grotesk", serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #f4faff;
}

/* Nút Quay về */
.back-button {
  align-self: flex-start;
  margin-bottom: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  color: #3b82f6;
  background-color: #ffffff;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.back-button:hover {
  background-color: #3b82f6;
  color: #ffffff;
}

.pricing-title {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
}

.pricing-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
}

/* Pricing Cards */
.pricing-cards {
  display: flex;
  gap: 16px;
  max-width: 900px;
  width: 100%;
  justify-content: center;
}

.pricing-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  width: 100%;
  max-width: 280px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Highlighted VIP Card */
.highlighted {
  background-color: #2563eb;
  color: #ffffff;
}

.highlighted .plan-price {
  color: #ffffff;
}

.highlighted .plan-features li {
  color: #ffffff;
}

.highlighted .cta-button {
  background-color: #ffffff;
  color: #2563eb;
}

/* Plan Title & Price */
.plan-title {
  font-size: 18px;
  font-weight: bold;
  color: inherit;
  margin-bottom: 16px;
}

.plan-price {
  font-size: 32px;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 24px;
}

.plan-price span {
  font-size: 16px;
  font-weight: normal;
  color: #6b7280;
}

/* Plan Features */
.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
}

.plan-features li {
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plan-features li:before {
  content: "✔️";
  margin-right: 8px;
  color: #fff;
}

.vip-plan .plan-features li:before {
  color: #ffffff;
}

/* CTA Button */
.cta-button {
  padding: 12px 20px;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  background-color: #3b82f6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-button:hover {
  color: #ffffff;
  background-color: #2563eb;
}
</style>
