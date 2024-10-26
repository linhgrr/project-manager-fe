<script>
import axios from "axios";
import TaskComponent from "@/components/TaskComponent.vue";
import DiscussionComponent from "@/components/DiscussionComponent.vue";

export default {
  components: {DiscussionComponent, TaskComponent},
  data() {
    return {
      projectData: '',
      selectedTab: 'tasks' // mặc định hiển thị Tasks
    };
  },
  props: {
    projectId: {
      type: String,
      required: true
    }
  },
  async mounted() {
    await this.fetchProjectData();
  },
  watch: {
    projectId: 'fetchProjectData'
  },
  methods: {
    async fetchProjectData() {
      const token = localStorage.getItem('token');
      const url = 'http://localhost:8080/api/projects/' + this.projectId;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.projectData = response.data.data;
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    },
    selectTab(tab) {
      this.selectedTab = tab;
    }
  }
};
</script>

<template>
  <div class="project-detail-container">
    <div class="info">
      <h1 class="title">
        {{ projectData.title }}
        <span class="icon">⚡</span>
      </h1>
      <h3 class="description">
        {{ projectData.description }}
      </h3>
    </div>

    <!-- Tab selector -->
    <div class="tab-selector">
      <button
          @click="selectTab('discussion')"
          :class="{ active: selectedTab === 'discussion' }">
        Discussion
      </button>
      <button
          @click="selectTab('tasks')"
          :class="{ active: selectedTab === 'tasks' }">
        Tasks
      </button>
      <div class="tab-underline" :style="{ left: selectedTab === 'tasks' ? '50%' : '0%' }"></div>
    </div>

    <!-- Tab content -->
    <div class="tab-content">
      <div v-if="selectedTab === 'tasks'">
        <TaskComponent />
      </div>
      <div v-if="selectedTab === 'discussion'">
        <DiscussionComponent />
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-detail-container {
  font-family: "Space Grotesk", serif;
  width: 100%;
}

.info{
  padding: 35px;
}

.info .title {
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.icon {
  font-size: 24px;
  margin-left: 8px;
}

.description {
  font-size: 14px;
  font-weight: 400;
  color: #666;
}

.tab-selector {
  display: flex;
  position: relative;
  margin-top: 20px;
  border-bottom: 1px solid #ddd;
}

.tab-selector button {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.tab-selector button.active {
  color: #007bff;
  font-weight: 600;
}

.tab-underline {
  position: absolute;
  bottom: -1px;
  width: 50%;
  height: 2px;
  background-color: #007bff;
  transition: left 0.3s ease;
}

.tab-content{
  width: 100%;
  height: 100%;
}
</style>
