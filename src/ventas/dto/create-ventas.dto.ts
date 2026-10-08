import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsEnum, IsInt, Min, ValidateNested } from "class-validator";
import { TipoPago } from "../../generated/prisma/enums.js";
import { ApiProperty } from "@nestjs/swagger";

export class VentaProductoDto{
    @ApiProperty({
        example:'1',
        description:'Ingresar el Numero de Producto Correctamente',
    })
    @Type(() => Number)
    @IsInt({message:'El ProductoId Debe ser un Numero Entero'})
    @Min(1,{message:'El ProductoId Debe Ser Un Numero Positivo'})
    productoId:number;
    
    @ApiProperty({
        example:'20',
        description:'Ingresar La Cantidad Correctamente',
    })
    @Type(() => Number)
    @IsInt({message:'La Cantidad Debe ser un Numero Entero'})
    @Min(1,{message:'La Cantidad Debe Ser Un Numero Positivo'})
    cantidad:number;
}
export class CreateVentaDto{
    @ApiProperty({
        example:'EFECTIVO',
        description:'Ingresar El Metodo Correctamente',
    })
    @IsEnum(TipoPago,{message:'El Tipo de Pago debe ser EFECTIVO|TARJETA'})
    metodoPago:TipoPago;

    @ApiProperty({
        example:[
            {
                productoId:1,
                cantidad: 20,
            }
        ],
        description:'Productos Incluidos Correctamente',
        type:[VentaProductoDto]
    })
    @IsArray()
    @ArrayMinSize(1,{message:'No puedes mandar un Array Vacio'})
    @ValidateNested({each:true})
    @Type(() => VentaProductoDto)
    ventaProductos: VentaProductoDto[];
}