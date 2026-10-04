import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber, IsPositive, IsInt, Min, IsDefined } from "class-validator";

export class CreateProductoDto {
    @ApiProperty({
        example:'Coca',
        description:'Ingresar El Nombre del Producto',
    })
    @IsString({message:"El nombre es una Cadena de Texto"})
    @Transform(({value}) => value?.trim())
    @IsNotEmpty({message:'El Nombre es Obligatrio'})
    nombre:string;
    
    @ApiProperty({
        example:'200.00',
        description:'Ingresar El Preco de la Compra',
    })
    @Type(() => Number)
    @IsDefined({ message: "El PrecioCompra es obligatorio" })
    @IsNumber({maxDecimalPlaces:2},{message:'El PrecioCompra Debe Tener 2 Decimales'})
    @IsPositive({message:'El PrecioCompra Debe Ser Positivo'})
    precioCompra:number;

    @ApiProperty({
        example:'200.00',
        description:'Ingresar El Precio de la Venta',
    })
    @Type(() => Number)
    @IsDefined({ message: "El PrecioVenta es obligatorio" })
    @IsNumber({maxDecimalPlaces:2},{message:'El PrecioVenta Debe Tener 2 Decimales'})
    @IsPositive({message:'El PrecioVenta Debe Ser Positivo'})
    precioVenta:number;

    @ApiProperty({
        example:'1',
        description:'Ingresar El Numero de Stock',
    })
    @Type(() => Number)
    @IsDefined({message:'El Stock es Obligatorio'})
    @IsInt({message:'El Stock Debe Ser Un Numero Entero'})
    @Min(0,{message:'El Stock No Puede Ser Negativo'})
    stock:number;

    @ApiProperty({
            example:'1',
            description:'Ingresar la categoriaId numerica',
        })
    @Type(() => Number)
    @IsDefined({message:'La CategoriaID es Obligatorio'})
    @IsInt({message:'La CategoriaID Debe Ser Un Numero Entero'})
    @Min(1,{message:'La CategoriaID No Puede Ser Negativo'})
    categoriaId:number;
}