<template>
  <div class="task-card">
    <h3 class="title">{{ title }}</h3>
    <p class="description">{{ description }}</p>
<!--    Danh dau-->
    <img v-if="image" :src="image" alt="Task image" class="task-image"/>
    <div class="footer">
      <span class="comments">{{ comments.length }}
        <img style="margin-left: 5px;" src="../../assets/cmt.svg" alt="cmt">
      </span>
      <span class="assignees">
        Assignee
        <img :src="assignee.pictureUrl" alt="Assignee" class="assignee-avatar"/>
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
    comments: Array,
    assignee: Object
  }
};
</script>

<style scoped>
.task-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 14px;
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
  color: #000;
}

.comments, .attachments {
  display: flex;
  align-items: center;
}

.assignees {
  display: flex;
  gap: 4px;
  align-items: center;
}

.assignee-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #fff;
}
</style>
