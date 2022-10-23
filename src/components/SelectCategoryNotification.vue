<script lang="ts" setup>
import {BIconArrowUp} from 'bootstrap-icons-vue';
export interface Props {
    show: string;
    arrow: boolean;
}
const props = withDefaults( defineProps<Props>(), {
    show: 'resources',
    arrow: true,
})
</script>
<template>
    <div
      class="text-center flex flex-col justify-center items-center mb-4 mx-2" >
        <div>
        <BIconArrowUp v-if="props.arrow" class="text-2xl"/></div>
        <h2>
        Select one or more resource categories from the list {{props.arrow ? 'above' : ''}} to view relevant {{props.show}}.
      </h2>
      </div>
</template>