<template>
  <div
      class="project-card"
      :class="{ 'active': isSelected }"
      @click="select"
  >
<!--    Danh dau-->
    <div class="project-image">
      <img :src="picture" alt="Project Image" />
    </div>
    <div class="project-info">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
    <div class="arrow-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    description: String,
    picture: String,
    isSelected: Boolean
  },
  methods: {
    select() {
      this.$emit('select');
    }
  }
};
</script>

<style scoped>
.project-card {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 28px;
  padding: 6px;
  width: 100%;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.project-card.active {
  background-color: #ffe6f2; /* Màu nền khi được chọn */
}
.project-image {
  display: flex;
  align-items: center;
}
.project-image img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
  margin-left: 10px;
}

.project-info {
  flex-grow: 1;
}

.project-info h3 {
  font-size: 16px;
  margin: 0;
  color: #333;
}

.project-info p {
  font-size: 12px;
  color: #888;
  margin: 5px 0 0;
}

.arrow-icon {
  margin-left: auto;
}

.arrow-icon svg {
  color: #000;
}
</style>
