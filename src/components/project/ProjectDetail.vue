<template>
  <div class="project-detail-container">
    <div class="info">
      <h1 class="title">
        {{ projectData.title }}
      </h1>
      <h3 class="description">
        {{ projectData.description }}
      </h3>
    </div>

    <div style="display: flex; justify-content: space-between" class="bar">
      <!-- Tab selector -->
      <div class="tab-selector" style="width: 30%">
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
      <div v-if="projectData.manager" class="staff-list-container" style="margin-right: 4%">
        <template v-for="(staff) in visibleStaffs" :key="staff.id">
          <img :src="staff.pictureUrl || defaultAvatar" :alt="staff.username" class="staff-avatar" />
        </template>
        <div v-if="extraStaffCount > 0" class="staff-more">+{{ extraStaffCount }}</div>
        <div class="add-button" @click="assignStaff">+</div>
      </div>
    </div>
    <AssignStaffModal
        v-show="isModalVisible"
        :project-id="projectData.id"
        @close="closeModal"
        :staffs="projectData.staffs"
    >
    </AssignStaffModal>

    <!-- Tab content -->
    <div class="tab-content">
      <div v-if="selectedTab === 'tasks'" class="tasks-tab">
        <TaskComponent
            :staff-list="projectData.staffs"
            :project-id="projectData.id"
        />
      </div>
      <div v-if="selectedTab === 'discussion'" class="discussion-tab">
        <DiscussionComponent :project-id="projectData.id"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TaskComponent from "@/components/task/TaskComponent.vue";
import DiscussionComponent from "@/components/DiscussionComponent.vue";
import AssignStaffModal from "@/components/modals/AssignStaffModal.vue";

export default {
  components: { AssignStaffModal, DiscussionComponent, TaskComponent },
  data() {
    return {
      projectData: {},
      selectedTab: 'tasks',
      defaultAvatar: 'https://i.ibb.co/BZ79FpY/default-avt.jpg',
      isModalVisible: false,
    };
  },
  props: {
    projectId: {
      type: String,
      required: true
    }
  },
  computed: {
    visibleStaffs() {
      return this.projectData.staffs ? this.projectData.staffs.slice(0, 3) : [];
    },
    extraStaffCount() {
      return this.projectData.staffs ? Math.max(this.projectData.staffs.length - 3, 0) : 0;
    }
  },
  async mounted() {
    await this.fetchProjectData();

    // Add event listeners
    window.addEventListener("resize", this.adjustHeight);
    this.adjustHeight(); // Initial adjustment
  },
  beforeUnmount() {
    // Remove event listeners to prevent memory leaks
    window.removeEventListener("resize", this.adjustHeight);
  },
  watch: {
    projectId: {
      immediate: true,
      handler: 'fetchProjectData'
    }
  },
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
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
        // Ensure DOM is updated before adjusting height
        this.$nextTick(() => {
          this.adjustHeight();
        });
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    },
    adjustHeight() {
      const elementAbove1 = document.querySelector(".info");
      const elementAbove2 = document.querySelector(".bar");
      const elementBelow = document.querySelector(".discussion-tab");
      if (elementAbove1 && elementAbove2 && elementBelow) {
        const heightAbove = elementAbove1.offsetHeight + elementAbove2.offsetHeight;
        elementBelow.style.height = `calc(100vh - ${heightAbove}px)`;
      }
    },
    selectTab(tab) {
      this.selectedTab = tab;
      // Adjust height when tab changes
      this.$nextTick(() => {
        this.adjustHeight();
      });
    },
    assignStaff() {
      this.showModal();
    }
  }
};
</script>


<style scoped>
.project-detail-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.info {
  padding: 20px;
  flex-shrink: 0;
}

.tab-content {
  flex: 1;
}

.discussion-tab {
  overflow: hidden;
}
.tasks-tab {
  height: 100%;
  overflow: visible;
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

/* Các style khác */
.staff-list-container {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px;
  border: 1px solid #e0e0e0;
  border-radius: 50px;
  background-color: #f5f5f5;
  margin: 20px 0;
}

.staff-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #fff;
  object-fit: cover;
  position: relative;
  z-index: 1;
}

.staff-avatar:not(:first-child) {
  margin-left: -15px;
}

.staff-more {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e7ff;
  color: #2979ff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  z-index: 1;
  margin-left: -15px;
}

.add-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: 2px dashed #2979ff;
  color: #2979ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  margin-left: 5px;
  z-index: 0;
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
</style>
