<template>
  <div class="task-board">
    <div v-for="column in columns" :key="column.name" class="task-column">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <h2>{{ column.name }}</h2>
        <span class="status-count">{{column.tasks.length}}</span>
        <button class="circle-button" @click="showModal(column.name)">+</button>
      </div>
      <div class="task-list">
        <TaskCard
            v-for="task in column.tasks"
            :key="task.id"
            :title="task.title"
            :description="task.description"
            :image="task.taskImageUrl"
            :comments="task.comments"
            :assignee="task.assignee"
            @click="showTaskDetails(task)"
        />
      </div>
    </div>
  </div>

  <!-- Modal hiển thị chi tiết Task -->
  <TaskDetail
      v-if="isModalVisible && selectedTask"
      :task="selectedTask"
      @close="closeModal"
  />

  <!-- Modal để tạo Task mới -->
  <CreateTaskComponent
      v-if="isModalVisible && !selectedTask"
      @close="closeModal"
      @submit="createTask"
      :staff-list="staffList"
      :project-id="projectId"
      :status="status"
  />
</template>


<script>
import TaskCard from './TaskCard.vue';
import CreateTaskComponent from "@/components/modals/CreateTaskModal.vue";
import axios from "axios";
import Swal from "sweetalert2";
import TaskDetail from "@/components/task/TaskDetail.vue";

const token = localStorage.getItem('token');

export default {
  name: "TaskComponent",
  components: {TaskDetail, CreateTaskComponent, TaskCard},
  props: {
    staffList: {
      type: Array,
      required: true
    },
    projectId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isModalVisible: false,
      status: '',
      selectedTask: null, // Thông tin của task được chọn để hiển thị trong modal chi tiết
      columns: [
        { name: "To do", tasks: [] },
        { name: "In progress", tasks: [] },
        { name: "In review", tasks: [] },
        { name: "Completed", tasks: [] }
      ]
    };
  },
  watch: {
    projectId(newVal) {
      if (newVal) {
        this.fetchTasks();
      }
    }
  },
  methods: {
    showModal(status) {
      this.status = status;
      this.isModalVisible = true;
      this.selectedTask = null; // Đặt null để tạo Task mới
    },
    showTaskDetails(task) {
      this.selectedTask = task; // Đặt task được chọn để hiển thị chi tiết
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.selectedTask = null; // Đặt lại task khi modal đóng
    },
    async createTask(data) {
      try {
        const url = `http://localhost:8080/api/projects/${this.projectId}/tasks`;
        await axios.post(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const task = data;
        task.comments = [];
        for (let i = 0; i < this.staffList.length; i++) {
          if (this.staffList[i].id === task.assigneeId) {
            task.assignee = this.staffList[i];
            break;
          }
        }
        const column = this.columns.find(c => c.name === task.status);
        if (column) {
          column.tasks.push(task);
        } else {
          console.warn(`Không tìm thấy cột cho trạng thái ${task.status}`);
        }

        Swal.fire({
          title: 'Thành công!',
          text: 'Task đã được tạo thành công.',
          icon: 'success',
        });
      } catch (e) {
        Swal.fire({
          title: 'Lỗi!',
          text: e.response?.data || 'Có lỗi xảy ra. Vui lòng thử lại.',
          icon: 'error',
        });
      }
    },
    async fetchTasks() {
      try {
        const url = `http://localhost:8080/api/projects/${this.projectId}/tasks`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tasks = response.data.data;
        console.log('allll');
        console.log(tasks);
        this.columns.forEach(column => column.tasks = []); // Xóa các task cũ
        tasks.forEach(task => {
          const column = this.columns.find(c => c.name === task.status);
          if (column) {
            column.tasks.push(task);
          }
        });
      } catch (e) {
        console.error("Failed to fetch tasks:", e);
      }
    }
  },
  mounted() {
    if (this.projectId) {
      this.fetchTasks();
    }
  }
};
</script>

<style scoped>
.task-board {
  font-family: "Space Grotesk", serif;
  display: flex;
  gap: 16px;
  padding: 16px;
  background-color: #F7F8FB; /* Light background similar to image */
  min-height: 100vh;
  overflow-x: auto; /* Allow scrolling if columns are wider */
}

.task-column {
  flex: 1;
}

.task-column h2 {
  font-size: 20px;
  color: #3A3A3A; /* Dark grey text */
  font-weight: 600;
  margin-bottom: 20px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Card shadow effect */
  transition: transform 0.3s;
  cursor: pointer;
}

.task-card:hover {
  transform: translateY(-5px); /* Lift the card slightly on hover */
}

.circle-button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #6C5CE7; /* Accent color for button */
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, box-shadow 0.3s;
}

.circle-button:hover {
  background-color: #4C47A5; /* Darker accent on hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

/* Style for the task image and assignee avatars */
.task-card .task-image {
  width: 100%;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 12px;
}

.task-card .assignee-list {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.task-card .assignee-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-count {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  border-radius: 50%;
  background-color: #FFFFFF; /* Màu nền trắng cho hình tròn chứa số */
  color: #333; /* Màu chữ đen */
  border: 1px solid #E0E0E0; /* Viền xám nhạt, giúp làm rõ hình tròn */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ để làm nổi bật */
  margin-right: auto;
  margin-left: 5px;
}

</style>

