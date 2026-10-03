import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Publico } from '../auth/decorators/publico.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@UseGuards(RolesGuard)
@Roles('ADMIN')
@Controller('users')
export class UsersController {
    constructor(private readonly userService:UsersService){}

    @Get()
    findAll(){
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id:string){
        return this.userService.findOne(+id);
    }

    @Post()
    create(@Body() data:CreateUserDto){
        return this.userService.create(data);
    }

    @Patch(':id')
    update(@Param('id') id:string, @Body() data:UpdateUserDto){
        return this.userService.update(+id,data);
    }

    @Delete(':id')
    remove(@Param('id') id:string){
        return this.userService.remove(+id);
    }
}
