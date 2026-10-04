import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { ProductosModule } from './productos/productos.module.js';
import { CategoriaModule } from './categoria/categoria.module.js';
import { ConfigModule } from '@nestjs/config';
import { envvalidationSchema } from './config/env.validation.js';
import { AuthModule } from './auth/auth.module.js';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { DireccionesModule } from './direcciones/direcciones.module.js';
import { CajasModule } from './cajas/cajas.module.js';


export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envvalidationSchema,
      validationOptions:{
        libraryOptions:{
          abortEarly: false,
          allowUnknown: true,
        },
      },
    }),
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'ecommerce-api',
    }),
    PrismaModule,
    UsersModule,
    ProductosModule,
    CategoriaModule,
    AuthModule,
    DireccionesModule,
    CajasModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, {provide:APP_GUARD, useClass:JwtAuthGuard}],
})
export class AppModule {}
