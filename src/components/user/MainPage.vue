<template>
  <div class="container">
    <SideBar style="width: 4%" @update-page="setPage" />
    <component class="component" :is="currentComponent" />
  </div>
</template>

<script>
import SideBar from "@/components/SideBar.vue";
import Dashboard from "@/components/DashboardPage.vue";
import Project from "@/components/project/ProjectPage.vue";
import UserPage from "@/components/user/UserPage.vue";

export default {
  components: {SideBar, Dashboard, Project, UserPage},
  data() {
    return {
      currentComponent: 'Project' // Component hiện tại
    };
  },
  methods: {
    setPage(page) {
      if (page === 'Dashboard') {
        this.currentComponent = 'Dashboard';
      } else if (page === 'Project') {
        this.currentComponent = 'Project';
      } else if (page === 'User') {
        this.currentComponent = 'UserPage';
      }
    }
  }
};
</script>

<style scoped>
  .container{
    display: flex;
  }

  .component{
    flex: 1;
  }
</style>
