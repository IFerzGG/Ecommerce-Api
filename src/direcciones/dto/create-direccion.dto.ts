import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from "class-validator";

export class CreateDireccionDto {
    
    @ApiProperty({
            example:'Av.Hidalgo',
            description:'Ingresar Calle o Avenida',
        })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    calle:string;

    @ApiProperty({
        example:'Veracruz',
        description:'Ingresar el Estado o Ciudad',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    ciudad:string;

    @ApiProperty({
        example:'Bolivia',
        description:'Ingresar el Pais',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    pais:string;

    @ApiProperty({
        example:'55000',
        description:'Ingresar Codigo Postal 5 Digitos',
    })
    @IsString()
    @IsNotEmpty()
    @Length(5, 5)
    codigoPostal:string;

    @ApiProperty({
        example:'Porton Blanco',
        description:'Ingresar Alguna Referencia Opcional',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    referencia?:string;
}