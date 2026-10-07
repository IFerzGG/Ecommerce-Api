import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { VentasService } from './ventas.service.js';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type {Request as ExpressRequest} from 'express';
import { Role } from '../generated/prisma/enums.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreateVentaDto } from './dto/create-ventas.dto.js';

@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
@Controller('ventas')
export class VentasController {
    constructor(private readonly ventasService:VentasService){}

    @ApiOperation({summary:'Mostrar Todas Las Ventas'})
    @ApiResponse({status:200, description:'Ventas Mostradas Exitosamente'})
    @Roles('ADMIN','CAJA')
    @Get()
    findAll(@Req() req:ExpressRequest){
        const user = req.user as {
            userId:number;
            role:Role;
        }
        if(user.role === 'ADMIN'){
            return this.ventasService.findAll();
        }
        return this.ventasService.findAllByUser(user.userId);
    }

    @ApiOperation({summary:'Mostrar Una Venta'})
    @ApiResponse({status:200, description:'Venta Mostrada Exitosamente'})
    @Roles('ADMIN')
    @Get(':id')
    findOne(@Param('id') id:string){
        return this.ventasService.findOne(+id);
    }

    @Roles('ADMIN','CAJA')
    @Post('caja/:id')
    create(@Param('id') cajaId:string, @Req() req:ExpressRequest, @Body() data:CreateVentaDto){
        const user = req.user as {
            userId:number;
        }
        return this.ventasService.create(+cajaId, user.userId, data);
    }
}
