import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CajasService } from './cajas.service.js';
import { MovCajasService } from './movimientosCaja.service.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type {Request as ExpressRequest} from 'express';
import { Role } from '../generated/prisma/enums.js';
import { CreateCajaDto } from './dto/create-caja.dto.js';
import { MovimientoCajaDto } from './dto/movimientoCaja.dto.js';
import { UpdateCajaDto, UpdateMovCajaDto } from './dto/update-caja.dto.js';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
@Controller('cajas')
export class CajasController {
    constructor(
        private readonly cajasService:CajasService,
        private readonly movCajasService:MovCajasService,
    ){}

    @ApiOperation({summary:'Mostrar Cajas'})
    @ApiResponse({status:200, description:'Cajas Mostradas Exitosamente'})
    @Roles('ADMIN','CAJA')
    @Get()
    findAll(@Req() req:ExpressRequest){
        const user = req.user as {
            userId:number;
            role:Role;
        }
        if(user.role === Role.ADMIN){
            return this.cajasService.findAll();
        }
        return this.cajasService.findByUser(user.userId);
    }

    @ApiOperation({summary:'Mostrar Una Caja'})
    @ApiResponse({status:200, description:'Caja Mostrada Exitosamente'})
    @Roles('ADMIN')
    @Get(':id')
    findOne(@Param('id') id:string){
        return this.cajasService.findOne(+id);
    }

    @ApiOperation({summary:'Mostrar Movimientos Caja'})
    @ApiResponse({status:200, description:'Movimiento de Caja Mostrada Exitosamente'})
    @Roles('ADMIN')
    @Get(':id/movimientos')
    findMov(@Param('id') id:string){
        return this.movCajasService.findAll(+id);
    }

    @ApiOperation({summary:'Crear Cajas'})
    @ApiResponse({status:200, description:'Caja Creada Exitosamente'})
    @ApiResponse({status:400, description:'Caja Mal Formateada'})
    @Roles('ADMIN','CAJA')
    @Post()
    create(@Query('usuarioId') usuarioId:string, @Req() req:ExpressRequest, @Body() data:CreateCajaDto){
        const user = req.user as {
            userId:number;
            role:Role;
        }
        if(user.role === Role.ADMIN){
            if(!usuarioId){
                throw new BadRequestException('El usuarioId es requerido');
            }
            return this.cajasService.create(+usuarioId, data);
        }
        if(usuarioId){
            throw new BadRequestException('No Tienes Permiso');
        }
        return this.cajasService.create(user.userId, data);
    }

    @ApiOperation({summary:'Crear Movimiento de Cajas'})
    @ApiResponse({status:200, description:'Movimiento de Caja Creada Exitosamente'})
    @ApiResponse({status:400, description:'Movimiento de Caja Mal Formateada'})
    @Roles('ADMIN','CAJA')
    @Post(':id/movimientos')
    createMov(@Param('id') id:string, @Req() req:ExpressRequest, @Body() data:MovimientoCajaDto){
        const user = req.user as {
            userId:number;
            role:Role;
        }
        if(user.role === Role.ADMIN){
            return this.movCajasService.create(+id,data);
        }
        return this.movCajasService.createByCaja(+id,user.userId,data);
    }

    @ApiOperation({summary:'Actualizar Estado de Caja'})
    @ApiResponse({status:200, description:'Estado de Caja Actualizada Exitosamente'})
    @ApiResponse({status:400, description:'Estado de Caja Mal Formateada'})
    @Roles('ADMIN','CAJA')
    @Patch(':id/cierre')
    update(@Param('id') id:string, @Body() data:UpdateCajaDto){
        return this.cajasService.update(+id,data);
    }

    @ApiOperation({summary:'Actualizar Movimientos de Caja'})
    @ApiResponse({status:200, description:'Movimientos de Caja Actualizada Exitosamente'})
    @ApiResponse({status:400, description:'Movimientos de Caja Mal Formateada'})
    @Roles('ADMIN')
    @Patch(':id/movimientos')
    updateMov(@Param('id') id:string, @Body() data:UpdateMovCajaDto){
        return this.movCajasService.update(+id, data);
    }
}
