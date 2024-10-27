``<template>
  <div class="login-page">
    <img src="../../assets/login_pic.svg" alt="" class="login-pic">
    <div class="login-container">
      <h2 class="login-title">Welcome back</h2>
      <p class="login-subtitle">Welcome back! Please enter your details.</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="warning">{{this.errorMessage}}</div>
        <div class="extras">
          <div class="terms">
            <input type="checkbox" id="terms" />
            <label for="terms">Terms & Conditions</label>
          </div>
        </div>
        <button type="submit" class="login-btn">Log in</button>
      </form>
      <p class="signup-text">
        Don’t have an account? <a :href="baseUrl + '/register'">Sign up for free</a>
      </p>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      baseUrl: window.location.origin
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:8080/api/users/login', {
          username: this.username,
          password: this.password,
        }
        );

        // Lưu JWT vào localStorage
        localStorage.setItem('token', response.data);
        // Điều hướng đến trang chủ
        this.$router.push('/');
      } catch (error) {
        this.errorMessage = "Username or password is wrong";
      }
    },
  },
};
</script>

<style scoped>
.warning{
  color: red;
  font-weight: bold;
  font-size: 16px;
}
.login-page{
  display: flex;
  padding: 10%;
  font-family: "Space Grotesk",serif;
}
.login-pic{
  width: 45%;
  height: auto;
}
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
}

.login-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 5px;
}

.login-subtitle {
  font-size: 20px;
  color: #777;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.input-group label {
  font-size: 20px;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.extras {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.terms {
  display: flex;
  align-items: center;
}

.terms label {
  margin-left: 5px;
  font-size: 12px;
}

.forgot-password {
  font-size: 12px;
  color: #007bff;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  background-color: black;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-btn:hover {
  background-color: #333;
}

.signup-text {
  font-size: 16px;
  color: #777;
  margin-top: 10px;
}

.signup-text a {
  color: #007bff;
  text-decoration: none;
}

.signup-text a:hover {
  text-decoration: underline;
}
</style>

``