<script lang="ts">
import { useTagStore } from '@/store';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
    props: {
        tagArr: {type: Array as PropType<string[]>, required: true}
    },
    setup(){
        const tagStore = useTagStore();
        return { tagStore }
    }
})
</script>
<template>
    <span v-for="tag in tagArr.values()">
      <routerLink :to="`../tag/${tagStore.toUrl(tag)}`"><button class="btn btn-link btn-small tag-link">{{ tag }}</button></routerLink>
    </span>
</template>