<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <h1>Task Dashboard</h1>
      <p>Manage your tasks efficiently</p>
    </header>

    <!-- Important Tasks Section -->
    <section class="important-tasks">
      <h2>Important Tasks</h2>
      <div v-if="importantTasks.length" class="task-list">
        <div v-for="task in importantTasks" :key="task.id" class="task-card important">
          <div class="card-header">
            <img :src="task.taskImageUrl" alt="Task Image" class="task-image">
          </div>
          <div class="card-body">
            <h3 class="task-title">{{ task.title }}</h3>
            <p class="task-description">{{ task.description }}</p>
          </div>
          <div class="card-footer">
            <span class="priority-badge high">High Priority</span>
            <span class="task-status">{{ task.status }}</span>
          </div>
        </div>
      </div>
      <p v-else class="empty-message">No high-priority tasks available.</p>
    </section>

    <!-- All Tasks Section -->
    <section class="all-tasks">
      <h2>All Tasks</h2>
      <div v-if="tasks.length" class="task-list">
        <div v-for="task in tasks" :key="task.id" class="task-card">
          <div class="card-header">
            <img :src="task.taskImageUrl" alt="Task Image" class="task-image">
          </div>
          <div class="card-body">
            <h3 class="task-title">{{ task.title }}</h3>
            <p class="task-description">{{ task.description }}</p>
          </div>
          <div class="card-footer">
            <span class="priority-badge" :class="task.priority.toLowerCase()">
              {{ task.priority }}
            </span>
            <span class="task-status">{{ task.status }}</span>
          </div>
        </div>
      </div>
      <p v-else class="empty-message">No tasks available.</p>
    </section>
  </div>
</template>

#### Script:
```javascript
<script>
import axios from "axios";

export default {
  data() {
    return {
      tasks: [],
      importantTasks: [],
      loading: true,
    };
  },
  methods: {
    async fetchTasks() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        this.loading = false;
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.tasks = response.data.data;
        this.importantTasks = this.tasks.filter(
            (task) => task.priority === "High"
        );
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchTasks();
  },
};
</script>

<style scoped>
/* Reset */
body {
margin: 0;
font-family: 'Roboto', Arial, sans-serif;
background-color: #f9f9f9;
color: #333;
}

/* Dashboard Layout */
.dashboard {
max-width: 1200px;
margin: 0 auto;
padding: 20px;
}

.dashboard-header {
text-align: center;
margin-bottom: 30px;
}

.dashboard-header h1 {
font-size: 2.5rem;
margin: 0;
color: #007bff;
}

.dashboard-header p {
font-size: 1rem;
color: #666;
}

/* Section Styling */
section {
margin-bottom: 40px;
}

h2 {
font-size: 1.5rem;
margin-bottom: 20px;
color: #007bff;
}

/* Task List */
.task-list {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 20px;
}

.task-card {
background: #fff;
border-radius: 8px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
overflow: hidden;
transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.task-card:hover {
transform: translateY(-5px);
box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.task-card.important {
border: 2px solid #ff4d4f;
}

/* Card Header */
.card-header {
height: 150px;
overflow: hidden;
}

.task-image {
width: 100%;
height: 100%;
object-fit: cover;
}

/* Card Body */
.card-body {
padding: 15px;
}

.task-title {
font-size: 1.25rem;
font-weight: bold;
color: #333;
margin: 0;
margin-bottom: 10px;
}

.task-description {
font-size: 0.9rem;
color: #555;
margin: 0;
}

/* Card Footer */
.card-footer {
display: flex;
justify-content: space-between;
align-items: center;
padding: 10px 15px;
background: #f8f9fa;
border-top: 1px solid #eee;
}

.priority-badge {
font-size: 0.8rem;
padding: 5px 10px;
border-radius: 12px;
text-transform: uppercase;
font-weight: bold;
}

.priority-badge.low {
background: #e7f3ff;
color: #007bff;
}

.priority-badge.medium {
background: #fff3cd;
color: #856404;
}

.priority-badge.high {
background: #f8d7da;
color: #721c24;
}

.task-status {
font-size: 0.8rem;
color: #666;
}

/* Empty Message */
.empty-message {
text-align: center;
font-size: 1rem;
color: #999;
}
</style>
