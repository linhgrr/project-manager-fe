<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- Profile Header -->
      <div class="profile-header">
        <!-- Avatar Section -->
        <div class="avatar-container">
          <img :src="profile.pictureUrl || 'https://via.placeholder.com/150'"
               alt="Avatar"
               class="avatar-image"
               loading="lazy" />
          <input type="file" @change="handleAvatarUpload" style="display: none" ref="fileInput" />
          <button @click="triggerFileInput" class="avatar-upload-button">+</button>
        </div>

        <!-- User Information -->
        <div class="user-info">
          <div v-if="loading" class="skeleton-loader user-name-loader"></div>
          <h2 v-else class="user-name" :class="{ 'rainbow-text': profile.subscribed }">
            {{ profile.username }}
            <span v-if="profile.subscribed" class="vip-tag">VIP</span>
          </h2>
          <p class="user-email">{{ profile.email }}</p>
        </div>

        <!-- Edit Button -->
        <button class="edit-button" @click="updateUser(profile)">Edit</button>

        <!-- Upgrade to VIP Button -->
        <button v-if="!profile.subscribed" class="upgrade-button" @click="navigateToPayment">Nâng cấp VIP</button>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading">
        <p>Loading...</p>
      </div>

      <!-- Form Section -->
      <div class="form-section" v-else>
        <!-- Full Name -->
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" v-model="profile.fullName" placeholder="Your Full Name" />
        </div>

        <!-- Address -->
        <div class="form-group">
          <label>Address</label>
          <input type="text" v-model="profile.address" placeholder="Your Address" />
        </div>

        <!-- Date of Birth -->
        <div class="form-group">
          <label>Date of Birth</label>
          <input type="date" v-model="profile.dateOfBirth" />
        </div>
      </div>
    </div>
  </div>
</template>




<script>
import axios from "axios";
import Swal from "sweetalert2";

const token = localStorage.getItem("token");

export default {
  data() {
    return {
      profile: {
        id: null,
        username: "",
        fullName: "",
        address: "",
        dateOfBirth: "",
        pictureUrl: "",
        subscribed: false  // Cờ kiểm tra nếu người dùng đã đăng ký
      },
      loading: true,
    };
  },
  created() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        const response = await axios.get("http://localhost:8080/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data;
        if (data.dateOfBirth) {
          const date = new Date(data.dateOfBirth);
          data.dateOfBirth = date.toISOString().split("T")[0];
        }
        this.profile = data;
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        this.loading = false;
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const { default: uploadImageService } = await import("@/service/UploadImageService");
        const response = await uploadImageService.uploadImage(file);
        const avatarUrl = response.data.url;
        this.profile.pictureUrl = avatarUrl;
        await this.updateUser(this.profile);

        Swal.fire({
          title: "Success!",
          text: "Avatar updated successfully.",
          icon: "success",
          confirmButtonText: "OK"
        });
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    },
    async updateUser(data) {
      try {
        await axios.post("http://localhost:8080/api/users/profile", data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        Swal.fire({
          title: "Success!",
          text: "User updated successfully.",
          icon: "success",
          confirmButtonText: "OK"
        });
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    },
    navigateToPayment() {
      // Điều hướng đến trang thanh toán
      this.$router.push({ path: "/payment" });
    }
  }
};
</script>



<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #f9f9f9;
}

.profile-container {
  width: 100%;
  max-width: 1200px;
  background: #ffffff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.avatar-container {
  position: relative;
  width: 80px;
  height: 80px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-upload-button {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #3b82f6;
  color: #ffffff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  margin-left: 16px;
  flex-grow: 1;
}

.user-name {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.rainbow-text {
  background-image: linear-gradient(90deg, #ff7e5f, #feb47b, #ffdd67, #a1ffce, #6dd5ed, #a1c4fd);
  background-size: 200% 100%;
  animation: rainbow-animation 3s linear infinite;
  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;
}

@keyframes rainbow-animation {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.vip-tag {
  background-color: #f59e0b;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  vertical-align: middle;
}

.user-email {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0 0;
}

.edit-button {
  background-color: #3b82f6;
  color: #ffffff;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  margin-right: 8px;
}

.upgrade-button {
  background-color: #f59e0b;
  color: #ffffff;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upgrade-button:hover {
  background-color: #d97706;
}

.form-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 6px;
}

.form-group input {
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: #f9fafb;
  font-size: 14px;
  color: #374151;
}

.form-group input:focus {
  border-color: #3b82f6;
  outline: none;
  background-color: #ffffff;
}

.skeleton-loader {
  background-color: #e0e0e0;
  height: 18px;
  border-radius: 4px;
  width: 100%;
}
</style>



