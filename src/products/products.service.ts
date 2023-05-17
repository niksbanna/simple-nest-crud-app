import { Injectable, NotFoundException } from "@nestjs/common";
import { Product } from "./product.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class ProductsService {

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) { }

    // * insert a product to databse
    async insertProduct(title: string, desc: string, price: number) {
        try {
            const newProduct = new this.productModel({ title, description: desc, price })
            const result = await newProduct.save();
            return result.id as string;
        } catch (error) {
            throw new NotFoundException('Error while inserting a product');
        }

    }

    // * get all products from databse
    async getProduct() {
        const products = this.productModel.find().exec();
        return (await products).map(prod => ({
            id: prod.id,
            title: prod.title,
            description: prod.description,
            price: prod.price
        }));
    }

    // * get a single product from databse
    async getSingleProduct(productId: string) {
        try {
            const product = await this.findProduct(productId);
            return { id: product.id, title: product.title, description: product.description, price: product.price };
        } catch (error) {
            throw new NotFoundException('Could not found any product');
        }

    }

    // * update a single product from databse
    async updateProduct(id: string, title: string, desc: string, price: number) {
        try {
            const updateProduct = await this.findProduct(id);
            if (title) updateProduct.title = title;
            if (desc) updateProduct.description = desc;
            if (price) updateProduct.price = price;
            updateProduct.save();
        } catch (error) {
            throw new NotFoundException('Could not found any product');
        }

    }

    // * A function to find a product from databse
    private async findProduct(id: string): Promise<Product> {
        try {
            const product = await this.productModel.findById(id);
            return product;
        } catch (error) {
            throw new NotFoundException('Could not found any product');
        }
    }

    // * delete a product form databse
    async deleteProduct(id: string) {
        try {
            const product = await this.findProduct(id);
            if (!product) throw new NotFoundException('Could not find product');
            const deleteProduct = await this.productModel.deleteOne({ _id: id }).exec();
            console.log(deleteProduct);
            return deleteProduct;
        } catch (error) {
            throw new NotFoundException('Could not find product');
        }
    }
}
