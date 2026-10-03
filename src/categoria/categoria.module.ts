import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service.js';
import { CategoriaController } from './categoria.controller.js';

@Module({
  providers: [CategoriaService],
  controllers: [CategoriaController]
})
export class CategoriaModule {}
