import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVentaDto } from './dto/create-ventas.dto.js';
import { TipoPago } from '../generated/prisma/enums.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class VentasService {
    constructor(private readonly prisma:PrismaService){}

    async findAll(){
        return await this.prisma.venta.findMany({
            orderBy:{id:'asc'},
        });
    }

    async findAllByUser(userId:number){
        return await this.prisma.venta.findMany({
            where:{
                userId,
            },
            orderBy:{id:'asc'},
            include:{user:{select:{nombre:true}}, ventaProductos:true,},
        });
    }

    async findOne(id:number){
        const existe = await this.prisma.venta.findUnique({
            where:{id},
            include:{
                user:{select:{nombre:true,},},
                ventaProductos:true,
            },
        });
        if(!existe){
            throw new NotFoundException('Venta No Encontrada');
        }
        return existe;
    }

    async create(cajaId:number, userId:number, data:CreateVentaDto){
        return this.prisma.$transaction(async (tx) => {
            const caja = await tx.caja.findUnique({
                where:{id:cajaId,},
            });
            if(!caja)throw new NotFoundException('No existe Caja');
            if(caja.estado !== 'ABIERTA') throw new BadRequestException('Caja Cerrada');

            const productosId = data.ventaProductos.map((producto) => producto.productoId);
            const productosUnicos = new Set(productosId);
            if(productosUnicos.size !== productosId.length)throw new BadRequestException('No puedes repetir productos de una venta')
            const productosExistentes = await tx.producto.findMany({
                where:{
                    id:{in:productosId},
                    activo:true,
                },
            });
            if(productosId.length !== productosExistentes.length) throw new NotFoundException('Uno o mas Productos no existen en el Almacen');
    //===============================================================================================================================================================            
            const detalleVenta = [];
            let total = new Prisma.Decimal(0);
            for(const item of data.ventaProductos){
                const producto = productosExistentes.find((p) => p.id === item.productoId);
                if(!producto)throw new NotFoundException('El producto'+item.productoId+'no existe');
                if(producto.stock < item.cantidad)throw new BadRequestException('Stock insuficiente del:'+producto.nombre+'Stock disponible:'+producto.stock);

                const subtotal = producto.precioVenta.mul(item.cantidad);
                total = total.add(subtotal);
                detalleVenta.push({
                    productoId:item.productoId,
                    cantidad:item.cantidad,
                    precioUnitario:producto.precioVenta,
                    subtotal,
                });
                //-----------------------------------------------------------------------------------------------------------------
                const resultado = await tx.producto.updateMany({
                    where:{
                        id:item.productoId,
                        stock:{gte:item.cantidad},
                    },
                    data:{
                        stock:{decrement:item.cantidad},
                    },
                });
                if(resultado.count === 0)throw new BadRequestException('No hay Stock para el producto'+item.productoId);
                await tx.producto.updateMany({
                    where:{
                        id:item.productoId,
                        stock:0,
                    },
                    data:{activo:false,},
                });
            }
    //===============================================================================================================================================
            const venta = await tx.venta.create({
                data:{
                    metodoPago:data.metodoPago,
                    total,
                    userId,
                    cajaId,
                },
            });
            await tx.ventaProducto.createMany({
                data: detalleVenta.map(detalleVenta => ({
                    ventaId:venta.id,
                    productoId:detalleVenta.productoId,
                    cantidad:detalleVenta.cantidad,
                    precioUnitario:detalleVenta.precioUnitario,
                    subtotal:detalleVenta.subtotal,
                })),
            });

            if(data.metodoPago === TipoPago.EFECTIVO){
                await tx.movimientoCaja.create({
                    data:{
                        tipo:'INGRESO',
                        monto:total,
                        cajaId,
                    },
                });
            }
    //===================================================================================================================
            return tx.venta.findUnique({
                where:{id:venta.id},
                include:{ventaProductos:true,},
            });
        })
    }
}
