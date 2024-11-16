<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import Repository from "@/api/repository";
import type Product from "@/api/models/Product";
import ProductDetail from "@/components/product/ProductDetail.vue";

const products = ref<Product[]>([])
const error = ref<string | null>(null)
const loading = ref<boolean>(false)
const repository = new Repository()

onMounted(async () => {
  await getProducts()
})

const getProducts = async () => {
  try {
    loading.value = true
    error.value = null

    products.value = await repository.viewProductList()
  } catch (e) {
    error.value = `${e}`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="!loading" class="product__list">
    <ProductDetail v-for="product in products" :key="product.id" :product="product"/>
  </div>
  <div v-else class="loading">
    <span class="ico ico-spinner"></span>
  </div>

  <div v-if="error" class="error">
    <p>{{ error }}</p>
    <button @click="window.location.reload()">Refresh</button>
  </div>
</template>

<style scoped>
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
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: 1em;
  margin-top: 1em;
}

.loading {
  text-align: center;
  margin-top: 50px;

  .ico-spinner {
    background: url('/public/spinner.svg') no-repeat 50%;
    background-size: contain;
    height: 100px;
    width: 100px;
    display: inline-block;
  }
}
</style>
