import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import type { Request as ExpressRequest } from "express";
import { RegisterAuthDto } from './dto/register.dto.js';
import { Publico } from './decorators/publico.decorator.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @HttpCode(HttpStatus.OK)
    @Publico()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: ExpressRequest){
        return this.authService.login(req.user);
    }

    @Publico()
    @Post('register')
    async register(@Body() data:RegisterAuthDto){
        return this.authService.register(data);
    }
}
