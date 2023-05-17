import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }

    @Post()
    async addProduct(
        @Body('title') productTitle: string,
        @Body('description') productDesc: string,
        @Body('price') productPrice: number
    ) {
        const generatedId = await this.productService.insertProduct(productTitle, productDesc, productPrice);
        return { id: generatedId };
    }

    @Get()
    async getAllProducts() {
        const products = await this.productService.getProduct();
        return products;
    }

    @Get(':id')
    getSingleProduct(@Param('id') prodId: string) {
        return this.productService.getSingleProduct(prodId);
    }

    @Patch(':id')
    async updateProduct(
        @Param('id') prodId: string,
        @Body('title') prodTitle: string,
        @Body('description') prodDesc: string,
        @Body('price') prodPrice: number
    ) {
        await this.productService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
        return null;
    }

    @Delete(':id')
    async deleteProduct(@Param('id') prodId: string) {
        return await this.productService.deleteProduct(prodId);
    }
}