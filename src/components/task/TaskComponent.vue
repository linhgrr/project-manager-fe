<template>
  <div class="task-board">
    <div v-for="column in columns" :key="column.name" class="task-column">
      <h2>{{ column.name }}</h2>
      <div class="task-list">
        <TaskCard
            v-for="task in column.tasks"
            :key="task.id"
            :title="task.title"
            :description="task.description"
            :image="task.image"
            :comments="task.comments"
            :assignees="task.assignees"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TaskCard from './TaskCard.vue';

export default {
  name: "TaskComponent",
  components: { TaskCard },
  data() {
    return {
      columns: [
        {
          name: "TO DO",
          tasks: [
            {
              id: 1,
              title: "Overall UX Process of full product for first version",
              description: "Gather requirements and initial design ideas.",
              comments: 12,
              assignees: [
                {
                  id: 1,
                  full_name: "Linh",
                },
                {
                  id: 2,
                  full_name: "Linh",
                },
              ],
              managers: [
                {
                  id: 1,
                  full_name: "Linh",
                  pictureUrl: ""
                },
                {
                  id: 2,
                  full_name: "Linh",
                  pictureUrl: ""
                },
              ]
            },
            {
              id: 2,
              title: "Do wireframe of same product",
              description: "Create a low-fidelity wireframe.",
              image: "https://via.placeholder.com/150",
              comments: 8,
              assignees: ["https://via.placeholder.com/24"]
            }
          ]
        },
        {
          name: "IN PROGRESS",
          tasks: [
            {
              id: 3,
              title: "Collect all details from client",
              description: "Gather detailed requirements from client.",
              image: "https://via.placeholder.com/150",
              comments: 5,
              assignees: ["https://via.placeholder.com/24", "https://via.placeholder.com/24"]
            },
            {
              id: 4,
              title: "Gather business insights",
              description: "Analyze client’s business objectives.",
              image: "https://via.placeholder.com/150",
              comments: 3,
              assignees: ["https://via.placeholder.com/24"]
            }
          ]
        },
        {
          name: "TO DO",
          tasks: [
            {
              id: 1,
              title: "Overall UX Process of full product for first version",
              description: "Gather requirements and initial design ideas.",
              image: "https://via.placeholder.com/150",
              comments: 12,
              assignees: ["https://via.placeholder.com/24", "https://via.placeholder.com/24"]
            },
            {
              id: 2,
              title: "Do wireframe of same product",
              description: "Create a low-fidelity wireframe.",
              image: "https://via.placeholder.com/150",
              comments: 8,
              assignees: ["https://via.placeholder.com/24"]
            }
          ]
        },
        {
          name: "TO DO",
          tasks: [
            {
              id: 1,
              title: "Overall UX Process of full product for first version",
              description: "Gather requirements and initial design ideas.",
              image: "https://via.placeholder.com/150",
              comments: 12,
              assignees: ["https://via.placeholder.com/24", "https://via.placeholder.com/24"]
            },
            {
              id: 2,
              title: "Do wireframe of same product",
              description: "Create a low-fidelity wireframe.",
              image: "https://via.placeholder.com/150",
              comments: 8,
              assignees: ["https://via.placeholder.com/24"]
            }
          ]
        },
      ]
    };
  }
};
</script>

<style scoped>
.task-board {
  font-family: "Space Grotesk",serif;
  display: flex;
  gap: 16px;
  padding: 16px;
  background-color: #E1E2EA;
}

.task-column {
  flex: 1;
  border-radius: 8px;
  padding: 4px;
}

.task-column h2 {
  font-size: 18px;
  color: #000;
  font-weight: bold;
  margin-bottom: 16px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
