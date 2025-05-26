<template>


  <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
    <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">{{ label }}</dt>
    <dd class="mt-1 text-sm text-gray-300 break-words">
      <template v-if="value === undefined || value === null || value === ''">
        <span class="italic text-gray-500">N/A</span>
      </template>
      <template v-else-if="typeof value === 'boolean'">
        <span :class="value ? 'text-green-400' : 'text-red-400'">{{ value ? 'Yes' : 'No' }}</span>
      </template>
      <template v-else-if="Array.isArray(value)">
        <ul v-if="value.length > 0" class="list-disc list-inside">
          <li v-for="(item, index) in value" :key="index">{{ item }}</li>
        </ul>
        <span v-else class="italic text-gray-500">Empty</span>
      </template>
      <template v-else-if="typeof value === 'object' && value !== null">
        <pre class="text-xl font-medium text-white">{{ JSON.stringify(value, null, 2) }}</pre>
      </template>
      <template v-else>
        {{ value }}
      </template>
    </dd>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: any; // Or be more specific: string | number | boolean | undefined | null | string[] | Record<string, any>;
}>();
</script>