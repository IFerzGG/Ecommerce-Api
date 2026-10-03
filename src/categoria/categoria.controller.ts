import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoriaService } from './categoria.service.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@UseGuards(RolesGuard)
@Controller('categoria')
export class CategoriaController {
    constructor(private readonly categoriaService:CategoriaService){}

    @Roles('ADMIN','CAJA','CLIENT')
    @Get()
    findAll(){
        return this.categoriaService.findAll();
    }

    @Roles('ADMIN','CAJA','CLIENT')
    @Get(':id')
    findOne(@Param('id') id:string){
        return this.categoriaService.findOne(+id);
    }

    @Roles('ADMIN','CAJA')
    @Post()
    create(@Body() data:CreateCategoriaDto){
        return this.categoriaService.create(data);
    }

    @Roles('ADMIN','CAJA')
    @Patch(':id')
    update(@Param('id') id:string, @Body() data:UpdateCategoriaDto){
        return this.categoriaService.update(+id,data);
    }

    @Roles('ADMIN','CAJA')
    @Delete(':id')
    remove(@Param('id') id:string){
        return this.categoriaService.remove(+id);
    }
}
