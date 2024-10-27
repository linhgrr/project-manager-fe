<template>
  <div class="side-bar">
    <div class="vip-logo">
      <img src="" alt="" class="team-logo" />
    </div>
    <div class="direct">
      <div
          class="dash-board option"
          :class="{ active: activeOption === 'Dashboard' }"
          @click="selectOption('Dashboard')"
      >
        <img src="../assets/dashboard.svg" alt="dashboard" class="logo" />
      </div>

      <div
          class="project option"
          :class="{ active: activeOption === 'Project' }"
          @click="selectOption('Project')"
      >
        <img src="../assets/prj.svg" alt="project" class="logo"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeOption: 'Project'
    };
  },
  methods: {
    selectOption(option) {
      this.activeOption = option;
      this.$emit('update-page', option);
    }
  }
};
</script>

<style scoped>
.side-bar {
  text-align: center;
  border-right: 1px solid #EBECF2;
  background: #F9FAFC;
  height: 924px;
}

.option {
  margin-top: 26px;
  cursor: pointer;
}

.logo {
  width: 35%;
  height: auto;
  transition: all 0.2s ease; /* Tạo hiệu ứng chuyển đổi từ từ */
}

/* Hiệu ứng khi option được chọn */
.option.active .logo {
  fill: rgba(255, 255, 255, 0.07);
  filter: drop-shadow(0px 13px 16px rgba(27, 39, 165, 0.89)) drop-shadow(-2px 5px 12px rgb(227, 100, 134));
  backdrop-filter: blur(5px);
}
</style>
