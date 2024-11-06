<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <h2>Add Task</h2>
          <button type="button" class="btn-close" @click="close">✖</button>
        </header>

        <section class="modal-body">
          <div class="scrollable-content">
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
                <label for="dueDate">Due Date</label>
                <input type="date" id="dueDate" v-model="dueDate" required />
              </div>
              <div class="form-group">
                <label for="priority">Priority</label>
                <select id="priority" v-model="priority" required>
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div class="form-group">
                <label for="assignee">Assignee</label>
                <select id="assignee" v-model="assigneeId" required>
                  <option v-for="staff in staffList" :key="staff.id" :value="staff.id">{{ staff.fullName }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="taskImage">Task Image</label>
                <div
                    class="image-upload-box"
                    @dragover.prevent="onDragOver"
                    @dragleave.prevent="onDragLeave"
                    @drop.prevent="onDrop"
                    @click="onClickUpload"
                >
                  <img v-if="imagePreviewUrl" :src="imagePreviewUrl" alt="Image Preview" />
                  <p v-else>Drag & drop an image, or click to upload</p>
                  <input type="file" ref="fileInput" style="display: none;" @change="onFileChange" />
                </div>
              </div>
            </form>
          </div>
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
  name: 'CreateTaskComponent',
  props: {
    staffList: {
      type: Array,
      required: true
    },
    projectId: {
      type: Number,
      required: true
    },
    status: String,
  },
  data() {
    return {
      title: '',
      description: '',
      startDate: '',
      dueDate: '',
      priority: 'Normal',
      assigneeId: null,
      selectedFile: null,
      imagePreviewUrl: null,
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
      // Kiểm tra xem tất cả các trường có được điền đầy đủ hay không
      if (!this.title) {
        Swal.fire({
          title: 'Error',
          text: 'Please fill in the title.',
          icon: 'warning',
        });
        return;
      }
      if (!this.description) {
        Swal.fire({
          title: 'Error',
          text: 'Please fill in the description.',
          icon: 'warning',
        });
        return;
      }
      if (!this.startDate) {
        Swal.fire({
          title: 'Error',
          text: 'Please select a start date.',
          icon: 'warning',
        });
        return;
      }
      if (!this.dueDate) {
        Swal.fire({
          title: 'Error',
          text: 'Please select a due date.',
          icon: 'warning',
        });
        return;
      }
      if (!this.priority) {
        Swal.fire({
          title: 'Error',
          text: 'Please select a priority level.',
          icon: 'warning',
        });
        return;
      }
      if (!this.assigneeId) {
        Swal.fire({
          title: 'Error',
          text: 'Please select an assignee.',
          icon: 'warning',
        });
        return;
      }

      try {
        // Nếu tất cả các trường đều hợp lệ, thực hiện tiếp tục quá trình submit
        let pictureUrl = 'https://i.ibb.co/Hg6cNNz/prj-default.jpg';

        if (this.selectedFile) {
          const response = await uploadImageService.uploadImage(this.selectedFile, "task_image");
          pictureUrl = response.data.url;
        }

        const taskData = {
          title: this.title,
          description: this.description,
          assigneeId: this.assigneeId,
          startDate: this.startDate,
          dueDate: this.dueDate,
          priority: this.priority,
          status: this.status,
          taskImageUrl: pictureUrl,
          projectId: this.projectId,
        };

        Swal.fire({
          title: 'Xác nhận tạo Task?',
          text: 'Bạn có chắc chắn muốn tạo task mới không?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, create it!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.$emit('submit', taskData);
            this.close();
          }
        });
      } catch (error) {
        console.error("Failed to submit task:", error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to upload image or submit task.',
          icon: 'error',
        });
      }
    }
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6); /* Darker, modern overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
}

.modal {
  background: #FFFFFF;
  width: 500px;
  padding: 30px;
  border-radius: 20px; /* Softer rounded corners */
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2); /* More pronounced shadow */
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #E0E0E0; /* Light grey divider */
  font-size: 22px;
  color: #333; /* Dark grey text */
}

.modal-body {
  padding: 20px 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px; /* More spacing between buttons */
  padding-top: 20px;
  border-top: 1px solid #E0E0E0;
}

.form-group {
  margin-bottom: 20px; /* Increased spacing for better readability */
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600; /* Slightly bolder label */
  margin-bottom: 8px;
  color: #3A3A3A; /* Dark grey for better contrast */
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 10px; /* More padding for comfort */
  font-size: 16px;
  border: 1px solid #D0D0D0;
  border-radius: 10px; /* Rounded input fields */
  color: #3A3A3A;
}

textarea {
  resize: vertical;
}

.image-upload-box {
  border: 2px dashed #9E9E9E;
  border-radius: 12px;
  width: 100%;
  height: 180px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.image-upload-box img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 10px; /* Rounded image corners */
}

.image-upload-box.drag-over {
  border-color: #5C6BC0; /* Blue border when dragging */
  background-color: #F0F4FF; /* Light blue background on drag */
}

.btn-close {
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: #9E9E9E; /* Soft color for close button */
  transition: color 0.3s ease;
}

.btn-close:hover {
  color: #333; /* Darker on hover */
}

.btn-submit {
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  background-color: #6200EA; /* Modern purple */
  color: #FFFFFF;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.btn-submit:hover {
  background-color: #3700B3; /* Darker purple on hover */
  transform: translateY(-3px);
}

.btn-cancel {
  padding: 12px 20px;
  border: 1px solid #6200EA;
  border-radius: 10px;
  background-color: #FFFFFF;
  color: #6200EA;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-cancel:hover {
  background-color: #6200EA;
  color: #FFFFFF;
}

.modal-body {
  padding: 20px 0;
  max-height: 400px; /* Đặt chiều cao tối đa cho modal-body */
  overflow-y: auto; /* Bật thanh cuộn dọc khi nội dung vượt quá */
}

.scrollable-content {
  padding-right: 15px; /* Thêm khoảng trống tránh nội dung bị ẩn sau thanh cuộn */
  max-height: 400px; /* Đặt chiều cao tối đa để nội dung có thể cuộn trong modal-body */
  overflow-y: auto; /* Cho phép cuộn dọc */
}

/* Đặt kiểu cho thanh cuộn để hiện đại hơn */
.modal-body::-webkit-scrollbar {
  width: 8px; /* Đặt độ rộng của thanh cuộn */
}

.modal-body::-webkit-scrollbar-track {
  background: #f0f0f0; /* Màu nền cho thanh cuộn */
  border-radius: 10px; /* Bo tròn phần track */
}

.modal-body::-webkit-scrollbar-thumb {
  background-color: #6200EA; /* Màu của thanh cuộn */
  border-radius: 10px; /* Bo tròn phần thanh cuộn */
  border: 2px solid #f0f0f0; /* Giảm độ sắc cạnh của thanh cuộn */
}

</style>
