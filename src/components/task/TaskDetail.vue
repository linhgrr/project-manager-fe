<template>
  <div v-if="task">
    <div class="backdrop" @click="$emit('close')"></div>
    <div class="task-detail-sidebar slide-in">
      <header class="sidebar-header">
        <h2>{{ task.title }}</h2>
        <button type="button" class="btn-close" @click="$emit('close')">✖</button>
      </header>
      <section class="sidebar-body">
        <p>{{ task.description }}</p>
        <div class="task-meta">
          <div class="task-info">
            <div class="task-detail-row">
              <p class="meta-label"><strong>Created by</strong></p>
              <div class="task-users">
                <div v-if="task.creator" class="user-pill">
                  <img :src="task.creator.pictureUrl" alt="Creator Image" class="user-avatar">
                  <span class="user-name">{{ task.creator.fullName }}</span>
                </div>
              </div>
            </div>
            <div class="task-detail-row">
              <p class="meta-label"><strong>Assigned to</strong></p>
              <div class="task-users">
                <div class="user-pill">
                  <img :src="task.assignee.pictureUrl" alt="Assignee Image" class="user-avatar">
                  <span class="user-name">{{ task.assignee.fullName }}</span>
                </div>
              </div>
            </div>
            <div class="task-detail-row">
              <p class="meta-label"><strong>Timeline</strong></p>
              <p>{{ formatDate(task.startDate) }} to {{ formatDate(task.dueDate) }}</p>
            </div>
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

        <!-- Sub Task Section -->
        <SubTaskList
            :subTasks="task.subTasks"
            :task-id="task.id"
        />

        <!-- Comments Section -->
        <div class="comments-section">
          <h3>Comments</h3>
          <div v-if="comments.length">
            <div v-for="comment in comments" :key="comment.id" class="comment">
              <p>
                <strong :class="{ 'user-name': true, 'vip': comment.author.subscribed }">
                  {{ comment.author.fullName }}
                </strong>
                : {{ comment.content }}
              </p>
              <small>{{ formatDate(comment.createdDate) }}</small>
            </div>

          </div>
          <div v-else>
            <p>No comments yet.</p>
          </div>

          <div class="add-comment">
            <textarea v-model="newComment" placeholder="Write a comment..." rows="3"></textarea>
            <button @click="submitComment" :disabled="!newComment">Add Comment</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SubTaskList from "@/components/task/SubTaskList.vue";
const token = localStorage.getItem("token");

export default {
  name: "TaskDetail",
  components: {SubTaskList},
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      newComment: ""
    };
  },
  methods: {
    formatDate(dateStr) {
      const options = {year: 'numeric', month: 'short', day: 'numeric'};
      return new Date(dateStr).toLocaleDateString('en-US', options);
    },
    fetchComments() {
      axios
          .get(`http://localhost:8080/api/tasks/${this.task.id}/comments`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => {
            this.comments = response.data;
          })
          .catch(error => {
            console.error("Error fetching comments:", error);
          });
    },
    submitComment() {
      const commentData = {
        taskId: this.task.id,
        content: this.newComment
      };
      axios
          .post(`http://localhost:8080/api/tasks/${this.task.id}/comments`, commentData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => {
            this.comments.push(response.data);
            this.newComment = "";
          })
          .catch(error => {
            console.error("Error adding comment:", error);
          });
    }
  },
  mounted() {
    this.fetchComments();
  }
};
</script>

<style scoped>
@keyframes rainbowText {
  0% { color: red; }
  16.66% { color: orange; }
  33.33% { color: yellow; }
  50% { color: green; }
  66.66% { color: blue; }
  83.33% { color: indigo; }
  100% { color: violet; }
}

.vip {
  animation: rainbowText 3s linear infinite;
  font-weight: bold;
}

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
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.slide-in {
  transform: translateX(0);
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
  overflow-y: auto;
  scrollbar-width: none;
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
  margin-bottom: 20px;
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

.comments-section {
  margin-top: 20px;
  color: #333; /* Dark text for better contrast */
}

.comments-section h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
  border-bottom: 1px solid #E0E0E0;
  padding-bottom: 5px;
}

.comment {
  background: #fff; /* White background for comment box */
  border: 1px solid #E0E0E0;
  padding: 15px;
  border-radius: 10px; /* Rounded corners for modern look */
  margin-bottom: 15px;
  transition: box-shadow 0.3s ease;
}


.comment p {
  font-size: 14px;
  color: #333;
  margin: 0;
}

.comment small {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #777;
}

.add-comment {
  margin-top: 20px;
}

.add-comment textarea {
  width: 93%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 14px;
  color: #333;
  background-color: #f5f5f5; /* Light background for input area */
  resize: none;
  transition: border-color 0.3s ease;
}

.add-comment textarea:focus {
  border-color: #333;
}

.add-comment button {
  margin-top: 10px;
  padding: 10px 16px;
  border: none;
  background-color: #333; /* Dark button for contrast */
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.add-comment button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.add-comment button:hover:not(:disabled) {
  background-color: #555;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

</style>
