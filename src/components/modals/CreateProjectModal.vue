<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <h2>Create new project</h2>
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
              <div
                  class="image-upload-box"
                  @dragover.prevent="onDragOver"
                  @dragleave.prevent="onDragLeave"
                  @drop.prevent="onDrop"
                  @click="onClickUpload"
              >
                <img v-if="imagePreviewUrl" :src="imagePreviewUrl" alt="Image Preview" />
                <p v-else>Drag and drop an image here, or click to select</p>
                <input type="file" ref="fileInput" style="display: none;" @change="onFileChange" />
              </div>
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
      selectedFile: null,
      imagePreviewUrl: null, // Thêm biến để lưu URL xem trước ảnh
    };
  },
  methods: {
    onDragOver(event) {
      event.currentTarget.classList.add('drag-over');
    },
    onDragLeave(event) {
      event.currentTarget.classList.remove('drag-over');
    },
    onDrop(event) {
      event.currentTarget.classList.remove('drag-over');
      const files = event.dataTransfer.files;
      if (files && files[0]) {
        this.handleFile(files[0]);
      }
    },
    onClickUpload() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.handleFile(file);
      }
    },
    handleFile(file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    close() {
      this.$emit('close');
    },
    async submitForm() {
      try {
        let pictureUrl = 'https://i.ibb.co/Hg6cNNz/prj-default.jpg';

        if (this.selectedFile) {
          const response = await uploadImageService.uploadImage(this.selectedFile, "project_image");
          pictureUrl = response.data.url;
        }

        const projectData = {
          title: this.title,
          description: this.description,
          startDate: this.startDate,
          endDate: this.endDate,
          status: this.status,
          pictureUrl: pictureUrl,
        };

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
            this.$emit('submit', projectData);
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
.image-upload-box {
  border: 2px dashed #ccc;
  border-radius: 5px;
  width: 200px;
  height: 200px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-upload-box img {
  max-width: 100%;
  max-height: 100%;
}

.image-upload-box.drag-over {
  border-color: #000;
  background-color: #f0f0f0;
}

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
