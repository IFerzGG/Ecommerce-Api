import { IsInt, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from "class-validator";

export class CreateDireccionDto {
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    calle:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    ciudad:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    pais:string;

    @IsString()
    @IsNotEmpty()
    @Length(5, 5)
    codigoPostal:string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    referencia?:string;
}