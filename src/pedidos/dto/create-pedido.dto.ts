import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, Min, ValidateNested } from "class-validator";

export class PedidoProductos{
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
export class CreatePedidoDto{
    @ApiProperty({
        example:'1',
        description:'Ingresar La Direccion Correctamente',
    })
    @Type(() => Number)
    @IsInt({message:'La DireccionId Debe ser un Numero Entero'})
    @Min(1,{message:'La DireccionId Debe Ser Un Numero Positivo'})
    direccionId:number;

    @ApiProperty({
        example:[
            {
                productoId:1,
                cantidad: 20,
            }
        ],
        description:'Productos Incluidos Correctamente',
        type:[PedidoProductos]
    })
    @IsArray()
    @ArrayMinSize(1,{message:'No puedes mandar un Array Vacio'})
    @ValidateNested({each:true})
    @Type(() => PedidoProductos)
    pedidoProductos: PedidoProductos[];
}