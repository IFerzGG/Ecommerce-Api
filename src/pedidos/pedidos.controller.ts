import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PedidosService } from './pedidos.service.js';
import type { Request as ExpressRequest } from 'express';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Role } from '../generated/prisma/enums.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreatePedidoDto } from './dto/create-pedido.dto.js';
import { UpdatePedidoDto } from './dto/update-pedido.dto.js';

@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
@Controller('pedidos')
export class PedidosController {
    constructor(private readonly pedidosService:PedidosService){}

    @Get()
    @ApiOperation({summary:'Mostrar Los Pedidos'})
    @ApiResponse({status:200, description:'Pedidos Mostrados Exitosamente'})
    findAll(@Req() req:ExpressRequest){
        const user = req.user as {
            userId:number;
            role:Role;
        }
        if(user.role === Role.ADMIN || user.role === Role.CAJA){
            return this.pedidosService.findByClient(user.userId);
        }
        return this.pedidosService.findAll();
    }

    @Roles('ADMIN','CAJA')
    @Get(':id')
    @ApiOperation({summary:'Mostrar El Pedido'})
    @ApiResponse({status:200, description:'Pedidido Mostrado Exitosamente'})
    findOne(@Param('id') id:number){
        return this.pedidosService.findOne(+id);
    }

    @Roles('CLIENT')
    @Post()
    @ApiOperation({summary:'Crea Tu Pedido'})
    @ApiResponse({status:200, description:'Pedidido Creado Exitosamente'})
    @ApiResponse({status:400, description:'Pedidido Mal Formateado'})
    create(@Req() req:ExpressRequest, @Body() data:CreatePedidoDto){
        const user = req.user as {
            userId:number;
        };
        return this.pedidosService.create(user.userId, data);
    }

    @Roles('ADMIN')
    @Patch(':id')
    @ApiOperation({summary:'Actualizar Estado del Pedido'})
    @ApiResponse({status:200, description:'Pedidido Actualizado Exitosamente'})
    @ApiResponse({status:400, description:'Estado del Pedidido Mal Formateado'})
    update(@Param('id') id:string, @Req() req:ExpressRequest, @Body() data:UpdatePedidoDto){
        const user = req.user as {
            userId:number,
            role:Role,
        }
        if(user.role === 'ADMIN'){
            return this.pedidosService.update(+id, data);
        }
        return this.pedidosService.updateClient(+id,user.userId, data);
    }
}
