<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <h2>Assign Staff</h2>
          <button type="button" class="btn-close" @click="close">x</button>
        </header>

        <section class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="search">Search User by Name:</label>
              <input
                  type="text"
                  id="search"
                  v-model="searchQuery"
                  @input="debouncedSearch"
                  placeholder="Enter name..."
              />
            </div>
            <ul v-if="users.length" class="user-list">
              <li v-for="user in users" :key="user.id" class="user-item">
                <button type="button" @click="selectUser(user)" class="user-button">
                  <img :src="user.pictureUrl || 'default-avatar.png'" alt="User Avatar" class="user-avatar" />
                  <span class="user-fullname">{{ user.fullName }}</span>
                </button>
              </li>
            </ul>
            <div v-if="selectedUsers.length">
              <h4>Selected Users:</h4>
              <ul class="selected-user-list">
                <li v-for="user in selectedUsers" :key="user.id" class="selected-user-item">
                  {{ user.fullName }}
                </li>
              </ul>
            </div>
          </form>
        </section>

        <footer class="modal-footer">
          <button type="button" class="btn-submit" @click="submitForm">Submit</button>
          <button type="button" class="btn-cancel" @click="close">Cancel</button>
        </footer>
      </div>
    </div>
  </transition>
</template>


<script>
import _ from 'lodash';
import axios from "axios";
const token = localStorage.getItem('token');

export default {
  props: {
    projectId: {
      type: String,
      required: true
    },
    staffs: {
      type: Array,
      required: true
    }
  },
  name: 'AssignStaffModal',
  data() {
    return {
      searchQuery: '',
      users: [],
      selectedUsers: [],
      allStaff: this.staffs
    };
  },
  watch: {
    staffs: {
      immediate: true,
      handler(newVal) {
        this.allStaff = newVal || [];
      }
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async submitForm() {
      for (const user of this.selectedUsers){
        let data = {
          staffId: user.id,
          projectId: this.projectId
        }
        try {
          await axios.post(`http://localhost:8080/api/projects/assign`, data,{
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error('Error assigning users:', error);
        }
      }

      this.close();
    },
    async searchUsers() {
      if (this.searchQuery.trim() === '') {
        this.users = [];
        return;
      }
      try {
        const response = await fetch(`http://localhost:8080/api/users?name=${this.searchQuery}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        this.users = data.filter(user => !this.allStaff.some(u => u.id === user.id));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    selectUser(user) {
      this.selectedUsers.push(user); // Thêm người dùng vào danh sách đã chọn
      this.allStaff.push(user);
      this.searchQuery = ''; // Reset ô tìm kiếm
      this.users = []; // Xóa danh sách người dùng đã tìm
    },
    debouncedSearch: _.debounce(function () {
      this.searchUsers();
    }, 300),
  },
};
</script>

<style>
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
}

.modal {
  background: #fff;
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  font-size: 18px;
}

.modal-body {
  padding: 20px 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.form-group input {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: #333;
}

.user-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.user-item {
  margin: 5px 0;
}

.user-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.user-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 40px; /* Kích thước hình ảnh đại diện */
  height: 40px; /* Kích thước hình ảnh đại diện */
  border-radius: 50%; /* Hình tròn */
  margin-right: 10px; /* Khoảng cách giữa ảnh và tên */
}

.user-fullname {
  font-size: 14px;
  color: #333;
}

.selected-user-list {
  margin-top: 10px;
}

.selected-user-item {
  font-weight: bold;
}

.btn-close {
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
}

.btn-submit {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  background-color: #333;
  color: #fff;
  cursor: pointer;
}

.btn-cancel {
  padding: 8px 15px;
  border: 1px solid #333;
  border-radius: 5px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
}
</style>

