<template>
  <div class="container">
    <SideBar style="width: 5%" @update-page="setPage" />
    <component class="component" :is="currentComponent" />
  </div>
</template>

<script>
import SideBar from "@/components/SideBar.vue";
import Dashboard from "@/components/DashboardPage.vue";
import Project from "@/components/ProjectPage.vue";

export default {
  components: {SideBar, Dashboard, Project},
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
