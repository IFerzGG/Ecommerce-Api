import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoriaDto {
    
    @ApiProperty({
            example:'Refresco',
            description:'Ingresar el Nombre de la Categoria',
        })
    @IsString({message:'El Nombre Debe Ser Una Cadena de Texto'})
    @Transform(({value}) => value?.trim())
    @IsNotEmpty({message:'El Nombre Es Obligatorio'})
    nombre:string;

    @ApiProperty({
        example:'Es muy rica',
        description:'Agregar Descripcion Opcional',
    })
    @IsOptional()
    @IsString({message:'El Nombre Debe Ser Una Cadena de Texto'})
    descripcion?:string;
}