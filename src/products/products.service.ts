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

  create(createProductDto: CreateProductDto) {
    const prod = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(prod);
  }

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

    const products = data.products.map((p) => ({
      name: p.title,
      price: p.price,
      image: p.thumbnail,
    }));

    await this.productsRepository.save(products);
    return { message: 'Dummy products seeded successfully' };
  }
}
