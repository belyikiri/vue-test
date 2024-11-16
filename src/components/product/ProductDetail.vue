<script lang="ts" setup>
import {type PropType, computed, ref} from 'vue'
import type Product from "@/api/models/Product";

const maxDescriptionSize = ref<number>(100)
const showMoreText = ref<string>('show more')
const showMore = ref<boolean>(false)

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
})

const isDescriptionTooLong = computed((): boolean => {
  return props.product.description.length > maxDescriptionSize.value
})

const formatCurrency = (price: number, currency: string = '€'): string => {
  const formatPrice = price.toFixed(2).split('.')

  return `${formatPrice} ${currency}`
}

const showFullText = (): void => {
  showMore.value = !showMore.value
}
</script>

<template>
  <div class="product">
    <div class="product__image">
      <picture>
        <img :src="product.image" :alt="product.title" loading="lazy" width="250" height="300" />
      </picture>
    </div>
    <div class="product__content">
      <div class="product__title">
        {{ product.title }}
      </div>
      <div class="product__description">
        <template v-if="isDescriptionTooLong && !showMore">
          {{ product.description.slice(0, maxDescriptionSize) }}<span class="product__show-more" @click="showFullText">&nbsp;...{{ showMoreText }}</span>
        </template>
        <template v-else>
          {{ product.description }}
        </template>
      </div>
      <div class="product__rating">
        <div class="product__rating-fav">
          {{ product.rating.rate}}<span class="ico ico-star"></span>
        </div>
        <div class="product__rating-count">
          &nbsp;({{ product.rating.count }} reviews)
        </div>
      </div>
      <div class="product__price">
        {{ formatCurrency(product.price) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.product {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  position: relative;
  min-width: 1px;

  .ico-star {
    background: url('/public/star.svg') no-repeat 50%;
    background-size: contain;
    margin: 0 5px;
    height: 18px;
    width: 18px;
    display: inline-block;
  }

  .product__image {
    display: flex;
    justify-content: center;
    border-radius: 12px;
  }

  .product__content {
    margin-top: 10px;
    line-height: 25px;

    .product__title {
      font-weight: 500;
      font-size: 16px;
      margin: 10px 0;
    }

    .product__description {
      color: #6c7880;

      .product__show-more {
        color: #181818;
        cursor: pointer;
      }

      .product__show-more:hover {
        text-decoration: underline;
      }
    }

    .product__rating {
      display: flex;

      .product__rating-fav {
        display: flex;
        align-items: center;
      }
    }

    .product__price {
      font-weight: 600;
      font-size: 18px;
    }
  }
}
</style>
