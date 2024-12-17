<template>
  <div class="sub-task-container">
    <!-- Tiêu đề SubTask -->
    <div class="sub-task-header">
      <div class="sub-task-title">Sub tasks</div>
      <div class="sub-task-counter">{{ completedSubTasks }}/{{ subTasks.length }}</div>
    </div>

    <!-- Thanh tiến trình -->
    <div class="progress-bar">
      <progress :value="completedSubTasks" :max="subTasks.length"></progress>
    </div>

    <!-- Danh sách SubTasks -->
    <div class="sub-task-list">
      <div
          v-for="subTask in subTasks"
          :key="subTask.id"
          class="sub-task-item"
      >
        <input
            type="checkbox"
            :id="'sub-task-' + subTask.id"
            :checked="subTask.status === 'COMPLETED'"
            @change="updateProgress(subTask, $event.target.checked)"
        />
        <label :for="'sub-task-' + subTask.id">{{ subTask.detailDescription }}</label>
      </div>
    </div>

    <!-- Thêm SubTask -->
    <div class="add-sub-task" @click="toggleInput" v-if="!showInput">
      <span>+ Add New Subtask</span>
    </div>
    <div v-else class="input-sub-task">
      <input
          v-model="newSubTaskDescription"
          type="text"
          placeholder="Enter subtask description"
          @keyup.enter="addSubTask"
          @blur="toggleInput"
      />
    </div>
  </div>
</template>



<script>
import axios from "axios";

export default {
  name: "SubTaskList",
  props: {
    subTasks: {
      type: Array,
      required: true,
    },
    taskId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      newSubTaskDescription: "", // Mô tả subtask mới
      showInput: false, // Hiển thị input thêm subtask
    };
  },
  computed: {
    // Tính số lượng subTasks đã hoàn thành
    completedSubTasks() {
      return this.subTasks.filter((task) => task.status === "COMPLETED").length;
    },
  },
  methods: {
    toggleInput() {
      this.showInput = !this.showInput;
      this.newSubTaskDescription = ""; // Reset input
    },
    addSubTask() {
      if (!this.newSubTaskDescription.trim()) {
        alert("Description cannot be empty.");
        return;
      }

      // Dữ liệu subtask mới
      const newTask = {
        detailDescription: this.newSubTaskDescription,
        status: "IN_PROGRESS",
        taskId: this.taskId,
      };

      axios
          .post(`http://localhost:8080/api/tasks/${this.taskId}/sub-tasks`, newTask, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
          .then((response) => {
            // Thêm subtask mới vào danh sách
            // eslint-disable-next-line vue/no-mutating-props
            this.subTasks.push({
              id: response.data.id,
              detailDescription: response.data.detailDescription,
              status: "IN_PROGRESS",
            });
            this.toggleInput(); // Ẩn input
          })
          .catch((error) => {
            console.error("Failed to add sub-task:", error);
          });
    },
    updateProgress(subTask, isChecked) {
      const updatedStatus = isChecked ? "COMPLETED" : "IN_PROGRESS";

      axios
          .post(
              `http://localhost:8080/api/tasks/${this.taskId}/sub-tasks`,
              {
                detailDescription: subTask.detailDescription,
                status: updatedStatus,
                taskId: subTask.taskId,
                id: subTask.id,
              },
              {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              }
          )
          .then(() => {
            subTask.status = updatedStatus; // Cập nhật trạng thái subtask
          })
          .catch((error) => {
            console.error("Failed to update sub-task:", error);
          });
    },
  },
};
</script>

<style scoped>
.sub-task-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  width: 94%;
  font-family: Arial, sans-serif;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sub-task-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 10px;
}

.progress-bar progress {
  width: 100%;
  height: 4px;
  border-radius: 4px;
  appearance: none;
}

progress::-webkit-progress-bar {
  background-color: #f0f0f0;
  border-radius: 4px;
}

progress::-webkit-progress-value {
  background-color: #ff4dd4;
  border-radius: 4px;
}

.sub-task-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sub-task-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

input[type="checkbox"] {
  transform: scale(1.2);
  accent-color: #0047ab;
}

.add-sub-task {
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
  color: #888;
  cursor: pointer;
}

.add-sub-task:hover {
  color: #000;
}

.input-sub-task input {
  margin-top: 8px;
  width: 95%;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}
</style>
