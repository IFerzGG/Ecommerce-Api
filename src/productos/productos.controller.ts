import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@UseGuards(RolesGuard)
@Controller('productos')
export class ProductosController {
    constructor(private readonly productoService:ProductosService){}

    @Get()
    findAll(@Query('categoriaId') categoriaId?:string){
        return this.productoService.findAll(categoriaId);
    }

    @Get(':id')
    findOne(@Param('id') id:string){
        return this.productoService.findOne(+id);
    }

    @Roles('ADMIN','CAJA')
    @Post()
    create(@Body() data:CreateProductoDto){
        return this.productoService.create(data);
    }

    @Roles('ADMIN','CAJA')
    @Patch(':id')
    update(@Param('id') id:string, @Body() data:UpdateProductoDto){
        return this.productoService.update(+id,data);
    }

    @Roles('ADMIN','CAJA')
    @Delete(':id')
    remove(@Param('id') id:string){
        return this.productoService.remove(+id);
    }
}
