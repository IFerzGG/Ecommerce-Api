import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { DireccionesService } from './direcciones.service.js';
import type { Request as ExpressRequest } from 'express';
import { Role } from '../generated/prisma/enums.js';
import { CreateDireccionDto } from './dto/create-direccion.dto.js';
import { UpdateDireccionDto } from './dto/update-direccion.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(RolesGuard)
@Controller('direcciones')
export class DireccionesController {
    constructor(private readonly direccionesService:DireccionesService){}

    @ApiOperation({summary:'Mostrar Direcciones'})
    @ApiResponse({status:200, description:'Direcciones Mostradas Exitosamente'})
    @Get()
    findAll(@Req() req:ExpressRequest){
        const user = req.user as {
            userId:number;
            role:Role;
        }
        if(user.role === Role.ADMIN || user.role === Role.CAJA){
            return this.direccionesService.findAll();
        }
        return this.direccionesService.findByUser(user.userId);

    }

    @ApiOperation({summary:'Mostrar una Direccion'})
    @ApiResponse({status:200, description:'Direccione Mostrada Exitosamente'})
    @Roles('ADMIN','CAJA')
    @Get(':id')
    finOne(@Param('id') id:string){
        return this.direccionesService.findOne(+id);
    }

    @ApiOperation({summary:'Crear Direcciones'})
    @ApiResponse({status:200, description:'Direccion Creada Exitosamente'})
    @ApiResponse({status:400, description:'Direccion Formateado Incorrectamente'})
    @Post()
    @Roles('ADMIN','CLIENT')
    create(@Query('userId') userId:string, @Req() req:ExpressRequest, @Body() data:CreateDireccionDto){
        const user = req.user as {
            userId:number;
            role:Role;
        }
        if(user.role === Role.ADMIN){
            if(!userId || isNaN(Number(userId))){
                throw new BadRequestException('userId es Requerido y debe ser un numero')
            }
            return this.direccionesService.create(+userId,data);
        }
        if(userId){
            throw new BadRequestException('No Tienes Permiso');
        }
        return this.direccionesService.create(user.userId,data);
    }

    @ApiOperation({summary:'Actualizar Direcciones'})
    @ApiResponse({status:200, description:'Direccion Aztualizada Exitosamente'})
    @ApiResponse({status:404, description:'Direccion No Encontrada Incorrectamente'})
    @Patch(':id')
    @Roles('ADMIN','CLIENT')
    update(@Param('id') id:string, @Req() req:ExpressRequest, @Body() data:UpdateDireccionDto){
        const user = req.user as {
            userId:number;
            role:Role;
        }
        if(user.role === Role.ADMIN){
            return this.direccionesService.update(+id,data);
        }
        return this.direccionesService.updateByUser(+id, user.userId, data);
    }

    @ApiOperation({summary:'Eliminar Direcciones'})
    @ApiResponse({status:200, description:'Direccion Eliminada Exitosamente'})
    @ApiResponse({status:404, description:'Direccion No Encontrada'})
    @Delete(':id')
    @Roles('ADMIN','CLIENT')
    remove(@Param('id') id:string, @Req() req:ExpressRequest){
        const user = req.user as {
            userId:number;
            role:Role;
        }
        if(user.role === Role.ADMIN){
            return this.direccionesService.remove(+id);
        }
        return this.direccionesService.removeByUser(+id,user.userId);
    }
}
