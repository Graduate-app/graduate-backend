import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraduandModule } from './graduand/graduand.module';
import { ReunionModule } from './reunion/reunion.module';
import { AdminModule } from './admin/admin.module';
import config from './config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProfilePictureService } from './graduand/services/profile-pictures.service';
import { ProfilePicture } from './graduand/entities/profile-picture.entity';
import { AuthModule } from './auth/admin.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.host,
      port: config.port,
      username: config.user,
      password: config.password,
      database: config.db,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([ProfilePicture]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    MailerModule.forRoot({
      transport: {
        host: config.email.host,
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
      },
    }),
    GraduandModule,
    ReunionModule,
    AdminModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProfilePictureService],
})
export class AppModule {}
