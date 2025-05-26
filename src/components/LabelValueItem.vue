<template>
  <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
    <dt :class="['text-xs uppercase tracking-wider text-gray-500 mb-1', labelClass]">{{ label }}</dt>
    <dd :class="effectiveValueClass">
      <slot :value="value" :displayValue="formatValueForDisplay(value, unit)">
        <template v-if="isNully(value)">
          <span class="italic text-gray-500">N/A</span>
        </template>
        <template v-else-if="typeof value === 'boolean'">
          <span class="flex items-center">
            <span class="inline-block w-2.5 h-2.5 rounded-full mr-2"
                  :class="value ? 'bg-green-500' : 'bg-red-500'"></span>
            <span>{{ value ? 'Enabled' : 'Disabled' }}</span>
          </span>
        </template>
        <template v-else-if="Array.isArray(value)">
          <ul v-if="value.length > 0" class="list-disc list-inside text-base"> <li v-for="(item, index) in value" :key="index">{{ item }}</li>
          </ul>
          <span v-else class="italic text-gray-500">Empty</span>
        </template>
        <template v-else-if="typeof value === 'object' && value !== null">
          <pre class="text-xs whitespace-pre-wrap break-all bg-gray-700/30 p-2 rounded">{{ JSON.stringify(value, null, 2) }}</pre>
        </template>
        <template v-else>
          {{ formatValueForDisplay(value, unit) }}
        </template>
      </slot>
    </dd>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  value: any;
  labelClass?: string;
  valueClass?: string; // Allows full override of dd classes for custom needs
  unit?: string;       // Optional unit to append to non-boolean, non-array, non-object values
}>();

const defaultValClass = 'mt-1 text-lg font-medium text-white break-words';

const effectiveValueClass = computed(() => {
  return props.valueClass || defaultValClass;
});

const isNully = (val: any): boolean => {
  return val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
};

const formatValueForDisplay = (val: any, unit?: string): string => {
  if (isNully(val) || typeof val === 'boolean' || Array.isArray(val) || typeof val === 'object') {
    // These types are handled by specific templates or should be handled by the slot if custom formatting beyond this is needed.
    // For the default template display, we just return them as is (or they won't reach here due to v-if).
    return String(val);
  }
  let displayVal = String(val);
  if (unit && displayVal !== 'N/A') { // Ensure unit is not appended to N/A
    displayVal += unit;
  }
  return displayVal;
};
</script>