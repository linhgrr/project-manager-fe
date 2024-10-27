<template>
  <div class="task-card">
    <h3 class="title">{{ title }}</h3>
    <p class="description">{{ description }}</p>
<!--    Danh dau-->
    <img src="https://picsum.photos/200" alt="Task image" class="task-image"/>
    <div class="footer">
      <span class="comments">{{ comments }} 💬</span>
      <span class="assignees">
        <img v-for="(assignee, index) in assignees" :key="index" :src="assignee" alt="Assignee" class="assignee-avatar"/>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskCard",
  props: {
    title: String,
    description: String,
    image: String,
    comments: Number,
    assignees: Array
  }
};
</script>

<style scoped>
.task-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin: 8px 0;
  color: #1f2937;
}

.description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.task-image {
  width: 100%;
  height: 100px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #9ca3af;
}

.comments, .attachments {
  display: flex;
  align-items: center;
}

.assignees {
  display: flex;
  gap: 4px;
}

.assignee-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #fff;
}
</style>
