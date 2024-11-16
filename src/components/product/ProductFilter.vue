<script lang="ts" setup>
import {onMounted, type PropType, ref} from 'vue'
import type Category from "@/api/models/Category";

const selectedCategories = ref<string[]>([])

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.has('categories')) {
    selectedCategories.value = params.get('categories')?.split(',') ?? []
  }
})

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

  updateUrl()
  emits('updateFilter', selectedCategories.value)
}

const resetFilters = () => {
  selectedCategories.value = []

  updateUrl()
  emits('updateFilter', selectedCategories.value)
}

const updateUrl = () => {
  const currentUrl = new URL(window.location.href)

  currentUrl.searchParams.delete('categories')
  if (selectedCategories.value.length) {
    currentUrl.searchParams.set('categories', selectedCategories.value.join(','))
  }

  history.pushState({}, '', currentUrl.toString())
}

const isCheckboxSelected = (categoryName: string): boolean => {
  return selectedCategories.value.includes(categoryName)
}
</script>

<template>
  <div class="product__filter">
    <div
        class="product__filter__checkbox"
        v-for="category in categories"
        :key="category.name"
    >
      <input
          type="checkbox"
          :value="category.name"
          :checked="isCheckboxSelected(category.name)"
          @change="selectCategory"
      />
      <label :for="category.name">{{
          `${category.name} (${category.count})`
        }}</label>
    </div>
    <button class="product__filter__reset" v-if="selectedCategories.length" @click.prevent="resetFilters">Reset</button>
  </div>
</template>

<style scoped>
.product__filter {
  margin: 20px 0;
  display: flex;
  justify-content: flex-start;
  gap: 20px;

  .product__filter__checkbox {
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

  .product__filter__reset {
    margin-left: 10px;
  }
}
</style>
