<template>
  <div class="project-page-container">
    <!-- Side bar -->
    <div class="side-bar">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <h1 class="title">All Project</h1>
        <button class="circle-button" @click="showModal">+</button>
      </div>
      <ModalComponent
          v-show="isModalVisible"
          @close="closeModal"
          @submit="createProject"
      />
      <div class="search-bar">
        <svg class="search-icon feather feather-search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" placeholder="Search Project" />
      </div>
      <div class="status" style="margin-bottom: 24px;">
        <div class="status-active btn active">
          Active
        </div>
        <div class="status-onhold btn">
          On Hold
        </div>
        <div class="status-closed btn">
          Closed
        </div>
      </div>
      <!-- Project list -->
      <div class="project-list" v-for="(item, index) in projectData" :key="index">
        <ProjectCard
            :title="item.title"
            :description="item.description.length > 15 ? item.description.slice(0, 15) + '...' : item.description"
            :picture="item.pictureUrl"
            :isSelected="item.id === selectedProjectId"
            @select="selectProject(item.id)"
        />
      </div>
    </div>

    <!-- Project Detail -->
    <div v-if="selectedProjectId" class="project-detail" style="flex: 1">
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
  components: {ModalComponent, ProjectCard, ProjectDetail },
  data() {
    return {
      projectData: [],
      selectedProjectId: null,
      isModalVisible: false,

    };
  },
  methods: {
    selectProject(id) {
      this.selectedProjectId = id;
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    async createProject(data) {
      const token = localStorage.getItem('token');
      try {
        // Gọi API để tạo project
        await axios.post('http://localhost:8080/api/projects', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Thực hiện khi thành công: thêm project mới vào danh sách
        this.projectData.push(data);

        // Thông báo thành công
        Swal.fire({
          title: 'Thành công!',
          text: 'Project đã được tạo thành công.',
          icon: 'success',
        });
      } catch (e) {
        // Thông báo lỗi nếu yêu cầu thất bại
        Swal.fire({
          title: 'Lỗi!',
          text: e.response?.data || 'Có lỗi xảy ra. Vui lòng thử lại.',
          icon: 'error',
        });
      }
    }

  },
  async mounted() {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8080/api/projects', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.data) {
        this.projectData = response.data.data;
        console.log(this.projectData);
      } else {
        this.projectData = [];
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      this.projectData = []; // Đặt lại projectData trong trường hợp có lỗi
    }
  }
};
</script>

<style scoped>
  .project-page-container{
    font-family: "Space Grotesk",serif;
    display: flex;
  }

  .side-bar .title{
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .side-bar{
    padding: 35px;
    width: 20%;
    border-right: 0.4px solid #EBECF2;
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

  .side-bar .status{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  .btn{
    font-size: 16px;
    display: flex;
    height: 32px;
    padding: 6px 12px;
    align-items: center;
    gap: 6px;
    justify-content: space-between;
  }

  .status .active{
    color: #FFF;
    background: #000;
    border-radius: 43px;
  }

  .project-list{
    margin-top: 10px;
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
</style>