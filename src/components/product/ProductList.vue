<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import Repository from "@/api/repository";
import type Product from "@/api/models/Product";
import ProductDetail from "@/components/product/ProductDetail.vue";
import type Category from "@/api/models/Category";
import ProductFilter from "@/components/product/ProductFilter.vue";

const products = ref<Product[]>([])
const selectedProducts = ref<Product[]>([])
const categories = ref<Category[]>([])
const selectedCategories = ref<string[]>([])
const error = ref<string | null>(null)
const loading = ref<boolean>(false)
const repository = new Repository()

onMounted(async () => {
  await getProducts()
  syncSelectedCategories()
  filterProducts()
})

const getProducts = async () => {
  try {
    loading.value = true
    error.value = null

    products.value = await repository.viewProductList()
    categories.value = [...new Set(products.value.map((product: Product) => product.category))]
        .map((categoryName) => ({
          name: categoryName,
          count: products.value.filter((product: Product) => product.category === categoryName).length,
        }))
        .sort((a: Category, b: Category) => b.count - a.count)
  } catch (e) {
    error.value = `${e}`
  } finally {
    loading.value = false
  }
}

const syncSelectedCategories = () => {
  const params = new URLSearchParams(window.location.search)
  if (params.has('categories')) {
    selectedCategories.value = params.get('categories')?.split(',') ?? []
  }
}

const filterProducts = () => {
  selectedProducts.value = selectedCategories.value.length === 0
      ? products.value
      : products.value.filter((product: Product) => selectedCategories.value.includes(product.category))
}

const updateFilter = (categories: string[]) => {
  selectedCategories.value = categories
}

watch(selectedCategories, () => {
  if (selectedCategories.value.length === 0) {
    selectedProducts.value = products.value

    return
  }

  selectedProducts.value = products.value.filter((product: Product) => {
    return selectedCategories.value.includes(product.category)
  })
})

const reloadPage = (): void => {
  window.location.reload()
}
</script>

<template>
  <template v-if="!loading && !error">
    <h1 class="main-title">Product list</h1>
    <ProductFilter :categories="categories" @update-filter="updateFilter"/>
    <div class="product__list">
      <ProductDetail v-for="product in selectedProducts" :key="product.id" :product="product"/>
    </div>
  </template>
  <div v-else-if="loading" class="loading">
    <span class="ico ico-spinner"></span>
  </div>
  <div v-else-if="error" class="error">
    <div>{{ error }}</div>
    <button @click.prevent="reloadPage">Refresh</button>
  </div>
</template>

<style scoped>
.main-title {
  margin-top: 20px;
}

.product__list {
  width: 100%;
  display: grid;
  gap: 20px 12px;
  margin: 40px 0;

  @media (min-width: 1560px) {
    grid-template-columns: repeat(5, 1fr);
  }
}

.error {
  margin-top: 10px;
  text-align: center;
  line-height: 30px;
}

.loading {
  text-align: center;
  margin-top: 50px;

  .ico-spinner {
    background: url('/spinner.svg') no-repeat 50%;
    background-size: contain;
    height: 100px;
    width: 100px;
    display: inline-block;
  }
}
</style>
