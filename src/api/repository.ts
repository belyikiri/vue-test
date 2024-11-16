import type Product from "@/api/models/Product";

export default class Repository {
    private url = 'https://fakestoreapi.com/products'

    async viewProductList(): Promise<Product[]> {
        const response = await fetch(this.url)
        if (response.ok) {
            return await response.json()
        }

        throw new Error(`${response.status}`)
    }
}