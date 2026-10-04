import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoriaService } from './categoria.service.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(RolesGuard)
@Controller('categoria')
export class CategoriaController {
    constructor(private readonly categoriaService:CategoriaService){}

    @ApiOperation({summary:'Mostrar Categorias'})
    @ApiResponse({status:200, description:'Categorias Mostradas Exitosamente'})
    @Roles('ADMIN','CAJA','CLIENT')
    @Get()
    findAll(){
        return this.categoriaService.findAll();
    }

    @ApiOperation({summary:'Mostrar una Categoria'})
    @ApiResponse({status:200, description:'Categoria Mostrada Exitosamente'})
    @Roles('ADMIN','CAJA','CLIENT')
    @Get(':id')
    findOne(@Param('id') id:string){
        return this.categoriaService.findOne(+id);
    }

    @ApiOperation({summary:'Crear Categorias'})
    @ApiResponse({status:200, description:'Categoria Creada Exitosamente'})
    @ApiResponse({status:400, description:'Categoria Formateado Incorrectamente'})
    @Roles('ADMIN','CAJA')
    @Post()
    create(@Body() data:CreateCategoriaDto){
        return this.categoriaService.create(data);
    }

    @ApiOperation({summary:'Actualizar a una Categoria'})
    @ApiResponse({status:200, description:'Categoria Actualizada Exitosamente'})
    @ApiResponse({status:404, description:'Categoria No Encontrada'})
    @Roles('ADMIN','CAJA')
    @Patch(':id')
    update(@Param('id') id:string, @Body() data:UpdateCategoriaDto){
        return this.categoriaService.update(+id,data);
    }

    @ApiOperation({summary:'Eliminar Categorias'})
    @ApiResponse({status:200, description:'Categoria Eliminada Exitosamente'})
    @ApiResponse({status:400, description:'Categoria No Encontrada'})
    @Roles('ADMIN','CAJA')
    @Delete(':id')
    remove(@Param('id') id:string){
        return this.categoriaService.remove(+id);
    }
}
