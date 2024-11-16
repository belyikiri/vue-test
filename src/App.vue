<script setup lang="ts">
import ProductList from "@/components/product/ProductList.vue";
</script>

<template>
  <div class="container">
    <ProductList />
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;

  @media (min-width: 1600px) {
    max-width: 1860px;
  }

  @media (min-width: 960px) {
    padding-right: 3rem;
    padding-left: 3rem;
  }
}
</style>
