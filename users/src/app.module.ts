import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { InternalController } from './internal.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserProfile } from './models/user-profile.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      // default schema for created tables; we also set it on the model
      define: { schema: process.env.DB_SCHEMA || 'users' },
      models: [UserProfile],
      autoLoadModels: true,   // dev: auto add models
      synchronize: true,      // dev: auto create tables
      logging: false,
    }),
    SequelizeModule.forFeature([UserProfile]),
    AuthModule,
  ],
  controllers: [AppController, UsersController, InternalController],
  providers: [AppService],
})
export class AppModule {}
