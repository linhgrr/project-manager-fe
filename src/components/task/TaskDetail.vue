<template>
  <div v-if="task">
    <div class="backdrop" @click="$emit('close')"></div>
    <div class="task-detail-sidebar">
      <header class="sidebar-header">
        <h2>{{ task.title }}</h2>
        <button type="button" class="btn-close" @click="$emit('close')">✖</button>
      </header>
      <section class="sidebar-body">
        <p>{{ task.description }}</p>
        <div class="task-meta">
          <div class="task-info">
            <!-- Created by -->
            <div class="task-detail-row">
              <p class="meta-label"><strong>Created by</strong></p>
              <div class="task-users">
                <div v-if="task.creator" class="user-pill">
                  <img :src="task.creator.pictureUrl" alt="Creator Image" class="user-avatar">
                  <span class="user-name">{{ task.creator.fullName }}</span>
                </div>
              </div>
            </div>

            <!-- Assigned to -->
            <div class="task-detail-row">
              <p class="meta-label"><strong>Assigned to</strong></p>
              <div class="task-users">
                <div class="user-pill">
                  <img :src="task.assignee.pictureUrl" alt="Assignee Image" class="user-avatar">
                  <span class="user-name">{{ task.assignee.fullName }}</span>
                </div>
              </div>
            </div>

            <!-- Timeline -->
            <div class="task-detail-row">
              <p class="meta-label"><strong>Timeline</strong></p>
              <p>{{ formatDate(task.startDate) }} to {{ formatDate(task.dueDate) }}</p>
            </div>

            <!-- Status -->
            <div class="task-detail-row">
              <p class="meta-label"><strong>Status</strong></p>
              <div class="status-info">
                <span class="status-dot"></span>
                <span>{{ task.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <img v-if="task.taskImageUrl" :src="task.taskImageUrl" alt="Task Image" class="task-image" />
      </section>
      <footer class="sidebar-footer">
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskDetail",
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    }
  }
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
}

.task-detail-sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: 400px;
  background: #FFFFFF;
  padding: 20px;
  box-shadow: -4px 0px 16px rgba(0, 0, 0, 0.1);
  z-index: 20;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  color: #333;
  padding-bottom: 20px;
  border-bottom: 1px solid #E0E0E0;
}

.sidebar-body {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto; /* Giữ chức năng cuộn */

  /* Ẩn thanh cuộn trên các trình duyệt Webkit (Chrome, Safari) */
  scrollbar-width: none; /* Ẩn thanh cuộn trên Firefox */
}

.sidebar-body::-webkit-scrollbar {
  width: 0; /* Ẩn thanh cuộn trên Chrome, Safari */
}

.task-meta {
  margin-top: 20px;
}

.task-detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.meta-label {
  min-width: 120px;
  font-weight: bold;
}

.task-users {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-pill {
  display: flex;
  align-items: center;
  background: #F7F7F8;
  border: 1px solid #E0E0E0;
  border-radius: 20px;
  padding: 5px 10px;
  gap: 5px;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.user-name {
  font-size: 14px;
  color: #333;
}

.status-info {
  display: flex;
  align-items: center;
}

.status-dot {
  width: 12px;
  height: 12px;
  background-color: #b95cff;
  border-radius: 50%;
  margin-right: 10px;
}

.task-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin-top: 20px;
}

.btn-close {
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: #9E9E9E;
  transition: color 0.3s ease;
}

.btn-close:hover {
  color: #333;
}

</style>