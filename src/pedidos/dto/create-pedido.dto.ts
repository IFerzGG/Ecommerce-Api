import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, Min, ValidateNested } from "class-validator";

export class CreatePedidoDto{
    @Type(() => Number)
    @IsInt({message:'La DireccionId Debe ser un Numero Entero'})
    @Min(1,{message:'La DireccionId Debe Ser Un Numero Positivo'})
    direccionId:number;

    @IsArray()
    @ArrayMinSize(1,{message:'No puedes mandar un Array Vacio'})
    @ValidateNested({each:true})
    @Type(() => PedidoProductos)
    pedidoProductos: PedidoProductos[];
}
export class PedidoProductos{
    @Type(() => Number)
    @IsInt({message:'El ProductoId Debe ser un Numero Entero'})
    @Min(1,{message:'El ProductoId Debe Ser Un Numero Positivo'})
    productoId:number;

    @Type(() => Number)
    @IsInt({message:'La Cantidad Debe ser un Numero Entero'})
    @Min(1,{message:'La Cantidad Debe Ser Un Numero Positivo'})
    cantidad:number;
}