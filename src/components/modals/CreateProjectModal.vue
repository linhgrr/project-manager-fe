<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <h2>Tạo Project Mới</h2>
          <button type="button" class="btn-close" @click="close">x</button>
        </header>

        <section class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="title">Title</label>
              <input type="text" id="title" v-model="title" required />
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" v-model="description" required></textarea>
            </div>
            <div class="form-group">
              <label for="startDate">Start Date</label>
              <input type="date" id="startDate" v-model="startDate" required />
            </div>
            <div class="form-group">
              <label for="endDate">End Date</label>
              <input type="date" id="endDate" v-model="endDate" required />
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="status" required>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div class="form-group">
              <label for="projectImage">Project Image</label>
              <input type="file" id="projectImage" @change="onFileChange" />
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
import Swal from "sweetalert2";
import uploadImageService from "@/service/UploadImageService";

export default {
  name: 'ModalComponent',
  data() {
    return {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'Active',
      selectedFile: null, // Thêm biến để lưu ảnh đã chọn
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    close() {
      this.$emit('close');
    },
    async submitForm() {
      try {
        let pictureUrl = 'https://i.ibb.co/Hg6cNNz/prj-default.jpg';

        // Nếu người dùng đã chọn ảnh, tải ảnh lên và lấy URL
        if (this.selectedFile) {
          const response = await uploadImageService.uploadImage(this.selectedFile, "project_image");
          pictureUrl = response.data.url;
        }

        // Tạo đối tượng projectData với URL ảnh
        const projectData = {
          title: this.title,
          description: this.description,
          startDate: this.startDate,
          endDate: this.endDate,
          status: this.status,
          pictureUrl: pictureUrl, // Thêm URL ảnh vào dữ liệu project
        };

        // Hiển thị xác nhận tạo project
        Swal.fire({
          title: 'Xác nhận tạo Project?',
          text: 'Bạn có chắc chắn muốn tạo project mới không?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, create it!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.$emit('submit', projectData); // Truyền projectData khi submit
            this.close();
          }
        });
      } catch (error) {
        console.error("Failed to submit project:", error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to upload image or submit project.',
          icon: 'error',
        });
      }
    },
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
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: #333;
}

textarea {
  resize: vertical;
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
