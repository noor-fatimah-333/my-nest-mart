import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  // create(createProductDto: CreateProductDto) {
  //   const prod = this.productsRepository.create(createProductDto);
  //   return this.productsRepository.save(prod);
  // }

  findAll() {
    return this.productsRepository.find();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} product`;
  // }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async seedDummyProducts() {
    const { data } = await axios.get('https://dummyjson.com/products');

    const products = data.products.map((product: Product) => {
      return this.productsRepository.create({
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        discountPercentage: product.discountPercentage,
        rating: product.rating,
        stock: product.stock,
        tags: product.tags,
        brand: product?.brand,
        sku: product.sku,
        weight: product.weight,
        dimensions: product.dimensions,
        warrantyInformation: product.warrantyInformation,
        shippingInformation: product.shippingInformation,
        availabilityStatus: product.availabilityStatus,
        returnPolicy: product.returnPolicy,
        minimumOrderQuantity: product.minimumOrderQuantity,
        meta: product.meta,
        images: product.images,
        thumbnail: product.thumbnail,
      });
    });
    await this.productsRepository.save(products);
    return { message: 'Dummy products seeded successfully' };
  }
}
