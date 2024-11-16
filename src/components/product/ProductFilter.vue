<script lang="ts" setup>
import {type PropType, ref} from 'vue'
import type Category from "@/api/models/Category";

const selectedCategories = ref<string[]>([])

defineProps({
  categories: {
    type: Object as PropType<Category[]>,
    required: true,
  },
})
const emits = defineEmits(['updateFilter'])

const selectCategory = (event: any) => {
  const categoryName: string = event.target.value
  if (event.target.checked) {
    selectedCategories.value = [...new Set([...selectedCategories.value, categoryName])] as string[]
  } else {
    selectedCategories.value = selectedCategories.value.filter((c: string) => c !== categoryName)
  }
  emits('updateFilter', selectedCategories.value)
}

const resetFilters = () => {
  selectedCategories.value = []
  emits('updateFilter', selectedCategories.value)
}
</script>

<template>
  <div class="product-filter">
    <div
        class="product-filter__checkbox"
        v-for="category in categories"
        :key="category.name"
    >
      <input
          type="checkbox"
          :id="category.name"
          :value="category.name"
          :checked="selectedCategories.includes(category.name)"
          @change="selectCategory"
      />
      <label :for="category.name">{{
          `${category.name} (${category.count})`
        }}</label>
    </div>
    <button class="product-filter__reset" v-if="selectedCategories.length" @click.prevent="resetFilters">Reset</button>
  </div>
</template>

<style scoped>
.product-filter {
  margin: 20px 0;
  display: flex;
  justify-content: flex-start;
  gap: 20px;

  .product-filter__checkbox {
    display: inline-block;

    input {
      display: none;

      &:checked + label:before {
        background: #000;
      }
    }

    label {
      cursor: pointer;

      &:before {
        content: '';
        border: 2px solid #000;
        border-radius: 5px;
        padding: 10px;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
        margin-right: 0.5em;
      }
    }
  }

  .product-filter__reset {
    margin-left: 10px;
  }
}
</style>
