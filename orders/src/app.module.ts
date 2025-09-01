import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './models/order.model';
import { InternalController } from './internal.controller';
import { AzpGuard } from './auth/azp.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      define: { schema: process.env.DB_SCHEMA || 'orders' },
      models: [Order],
      autoLoadModels: true,
      synchronize: true,         // create if not exists
      sync: { alter: true },     // <-- DEV ONLY: alter to match model
      logging: console.log,      // <-- TEMP: see CREATE/ALTER statements
    }),
    SequelizeModule.forFeature([Order]),
    AuthModule,
  ],
  controllers: [OrdersController, InternalController],
  providers: [OrdersService, AzpGuard],
})
export class AppModule {}
