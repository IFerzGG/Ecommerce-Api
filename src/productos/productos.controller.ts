import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request as ExpressRequest } from 'express';
import { Role } from '../generated/prisma/enums.js';

@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
@Controller('productos')
export class ProductosController {
    constructor(private readonly productoService:ProductosService){}

    @ApiOperation({summary:'Mostrar todos los Productos'})
    @ApiResponse({status:200, description:'Productos Mostrados Exitosamente'})
    @Get()
    findAll(@Req() req:ExpressRequest, @Query('categoriaId') categoriaId?:string){
        const user = req.user as {
            userId:number;
            role:Role;
        }
        if(user.role === Role.ADMIN || user.role === Role.CAJA){
            return this.productoService.findAll(categoriaId);
        }
        return this.productoService.findAllClient(categoriaId);
    }

    @ApiOperation({summary:'Mostrar Un Producto'})
    @ApiResponse({status:200, description:'Producto Mostrado Exitosamente'})
    @Get(':id')
    findOne(@Param('id') id:string){
        return this.productoService.findOne(+id);
    }

    @ApiOperation({summary:'Crear Productos'})
    @ApiResponse({status:200, description:'Producto Creado Exitosamente'})
    @ApiResponse({status:400, description:'Producto Formateado Incorrectamente'})
    @Roles('ADMIN','CAJA')
    @Post()
    create(@Body() data:CreateProductoDto){
        return this.productoService.create(data);
    }

    @ApiOperation({summary:'Actualizar Productos'})
    @ApiResponse({status:200, description:'Producto Actualizado Exitosamente'})
    @ApiResponse({status:400, description:'Producto no Encontrado'})
    @Roles('ADMIN','CAJA')
    @Patch(':id')
    update(@Param('id') id:string, @Body() data:UpdateProductoDto){
        return this.productoService.update(+id,data);
    }

    @ApiOperation({summary:'Eliminar Productos'})
    @ApiResponse({status:200, description:'Producto Eliminado Exitosamente'})
    @ApiResponse({status:400, description:'Producto no Encontrado'})
    @Roles('ADMIN','CAJA')
    @Delete(':id')
    remove(@Param('id') id:string){
        return this.productoService.remove(+id);
    }
}
