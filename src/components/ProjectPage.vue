<template>
  <div class="project-page-container">
    <!-- Side bar -->
    <div class="side-bar">
      <h1 class="title">All Project</h1>
      <div class="search-bar">
        <svg class="search-icon feather feather-search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" placeholder="Search Project" />
      </div>
      <div class="status">
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
            :picture="item.picture"
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
import ProjectCard from "@/components/ProjectCard.vue";
import ProjectDetail from "@/components/ProjectDetail.vue";
import axios from "axios";

export default {
  name: 'ProjectPage',
  components: { ProjectCard, ProjectDetail },
  data() {
    return {
      projectData: [],
      selectedProjectId: null,
    };
  },
  methods: {
    selectProject(id) {
      this.selectedProjectId = id;
    }
  },
  async mounted() {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8080/api/projects', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    this.projectData = response.data.data;
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
    width: 15%;
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
    margin-top: 28px;
  }
</style>