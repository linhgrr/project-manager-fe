<template>
  <div class="project-page-container">
    <!-- Side bar -->
    <div class="side-bar">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <h1 class="title">All Project</h1>
        <button class="circle-button" @click="showModal">+</button>
      </div>
      <ModalComponent
          v-if="isModalVisible"
          @close="closeModal"
          @submit="createProject"
      />
      <div class="search-bar">
        <svg class="search-icon feather feather-search">
          <svg class="search-icon feather feather-search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </svg>
        <input
            type="text"
            placeholder="Search Project"
            v-model="searchQuery"
        />
      </div>
      <div class="status" style="margin-bottom: 24px;">
        <div
            class="status-active btn"
            :class="{ active: selectedStatus === 'Active' }"
            @click="setStatusFilter('Active')"
        >
          Active
        </div>
        <div
            class="status-onhold btn"
            :class="{ active: selectedStatus === 'On Hold' }"
            @click="setStatusFilter('On Hold')"
        >
          On Hold
        </div>
        <div
            class="status-closed btn"
            :class="{ active: selectedStatus === 'Closed' }"
            @click="setStatusFilter('Closed')"
        >
          Closed
        </div>
      </div>
      <!-- Project list with loading skeleton -->
      <div v-if="loading" class="project-list-skeleton">
        <div class="skeleton-card" v-for="n in 5" :key="n"></div>
      </div>
      <div v-else class="project-list">
        <ProjectCard
            v-for="(item, index) in filteredProjects"
            style="margin-bottom: 10px"
            :key="index"
            :title="item.title"
            :description="item.description?.length > 15 ? item.description.slice(0, 15) + '...' : item.description"
            :picture="item.pictureUrl"
            :isSelected="item.id === selectedProjectId"
            @select="selectProject(item.id)"
        />
      </div>
    </div>

    <!-- Project Detail with loading skeleton -->
    <div v-if="selectedProjectId" class="project-detail" style="flex: 1; max-height: 100vh">
      <ProjectDetail :projectId="selectedProjectId" />
    </div>
  </div>
</template>

<script>
import ProjectCard from "@/components/project/ProjectCard.vue";
import ProjectDetail from "@/components/project/ProjectDetail.vue";
import axios from "axios";
import ModalComponent from "@/components/modals/CreateProjectModal.vue";
import Swal from "sweetalert2";

export default {
  name: 'ProjectPage',
  components: { ModalComponent, ProjectCard, ProjectDetail },
  data() {
    return {
      projectData: [],
      selectedProjectId: null,
      isModalVisible: false,
      loading: true,
      selectedStatus: 'Active', // Trạng thái mặc định
      searchQuery: '', // Thuộc tính cho tìm kiếm
    };
  },
  computed: {
    filteredProjects() {
      return this.projectData.filter(item => {
        const matchesStatus = this.selectedStatus ? item.status === this.selectedStatus : true;
        const matchesSearch = this.searchQuery
            ? item.title.toLowerCase().includes(this.searchQuery.toLowerCase())
            : true;
        return matchesStatus && matchesSearch;
      });
    },
  },
  methods: {
    selectProject(id) {
      this.selectedProjectId = id;
    },
    showModal() {
      const isSubscribed = localStorage.getItem('subscribed');
      if (isSubscribed === 'false' && this.projectData.length >= 2) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Vui lòng nạp vip để được tạo thêm project',
          icon: 'error',
        });
        return;
      }
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    async createProject(data) {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.post('http://localhost:8080/api/projects', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.projectData.push(response.data);

        Swal.fire({
          title: 'Thành công!',
          text: 'Project đã được tạo thành công.',
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
    setStatusFilter(status) {
      this.selectedStatus = status;
    },
  },
  async mounted() {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8080/api/projects', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.projectData = response.data?.data || [];
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.project-page-container {
  font-family: "Space Grotesk", serif;
  display: flex;
}

.side-bar .title {
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.side-bar {
  padding: 35px;
  width: 20%;
  border-right: 0.4px solid #EBECF2;
  max-height: 100vh;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f5f6fb;
  border-radius: 30px;
  padding: 10px;
  width: 100%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #4A4A4A;
  margin-right: 10px;
}

input {
  border: none;
  outline: none;
  background-color: transparent;
  color: #4A4A4A;
  font-size: 16px;
}

input::placeholder {
  color: #9B9B9B;
}

input:focus {
  outline: none;
}

.status {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  font-size: 16px;
  display: flex;
  height: 32px;
  padding: 6px 12px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s; /* Thêm chuyển đổi mượt mà */
}

.status .btn.active {
  color: #FFF;
  background: #000;
  border-radius: 43px;
}

.project-list {
  margin-top: 10px;
  max-height: 100vh;
}

.circle-button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(0, 123, 255, 0);
  color: black;
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
  background-color: rgba(0, 86, 179, 0);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

/* Loading Skeleton */
.project-list-skeleton {
  display: grid;
  gap: 10px;
}

.skeleton-card {
  background-color: #e0e0e0;
  height: 60px;
  border-radius: 8px;
  animation: shimmer 1.2s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}
</style>
