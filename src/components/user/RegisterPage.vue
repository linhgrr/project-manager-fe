<template>
  <div class="register-page">
    <img src="../../assets/login_pic.svg" alt="" class="register-pic">
    <div class="register-container">
      <h2 class="register-title">Create an Account</h2>
      <p class="register-subtitle">Sign up to get started!</p>
      <form @submit.prevent="handleSignup" class="register-form">
        <div class="input-group">
          <label for="fullname">Full Name</label>
          <input type="text" id="fullname" v-model="fullname" required />
        </div>
        <div class="input-group">
          <label for="address">Address</label>
          <input type="text" id="address" v-model="address" required />
        </div>
        <div class="input-group">
          <label for="dob">Date of Birth</label>
          <input type="date" id="dob" v-model="dateofbirth" required />
        </div>
        <div class="input-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="extras">
          <div class="terms">
            <input type="checkbox" id="terms" required />
            <label for="terms">I agree to the Terms & Conditions</label>
          </div>
        </div>
        <button type="submit" class="register-btn">Sign Up</button>
      </form>
      <p class="login-text">
        Already have an account? <a :href="baseUrl + '/login'">Log in</a>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      fullname: '',
      address: '',
      dateofbirth: '',
      username: '',
      password: '',
      errorMessage: '',
      baseUrl: window.location.origin
    };
  },
  methods: {
    async handleSignup() {
      try {
        const response = await axios.post('http://localhost:8080/api/users/register', {
          fullname: this.fullname,
          address: this.address,
          date_of_birth: this.dateofbirth,
          username: this.username,
          password: this.password,
          picture_url: "https://i.ibb.co/BZ79FpY/default-avt.jpg"
        });
        localStorage.setItem('token', response.data);
        this.$router.push('/login');
      } catch (error) {
        this.errorMessage = error;
      }
    },
  },
};
</script>

<style scoped>
.register-page {
  display: flex;
  padding: 10%;
  font-family: "Space Grotesk", serif;
}
.register-pic {
  width: 45%;
  height: auto;
}
.register-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
}

.register-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 5px;
}

.register-subtitle {
  font-size: 20px;
  color: #777;
  margin-bottom: 20px;
}

.register-form {
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

.register-btn {
  background-color: black;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.register-btn:hover {
  background-color: #333;
}

.login-text {
  font-size: 16px;
  color: #777;
  margin-top: 10px;
}

.login-text a {
  color: #007bff;
  text-decoration: none;
}

.login-text a:hover {
  text-decoration: underline;
}
</style>
