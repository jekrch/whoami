// src/App.vue
<script setup lang="ts">
import UserDashboard from './components/UserInfoItem.vue'; // Changed alias for clarity
// Or stick with: import UserInfoItem from './components/UserInfoItem.vue';
// if you want to refer to your dashboard as UserInfoItem in App.vue's template
</script>

<template>
  <div>
    <UserDashboard />
    </div>
</template>