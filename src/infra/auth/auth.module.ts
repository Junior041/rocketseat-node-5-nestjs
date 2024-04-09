import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { EnvService } from '../env/env.service';
import { EnvModule } from '../env/env.module';

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			imports: [EnvModule],
			inject:[EnvService],
			global: true,
			useFactory(env: EnvService) {
				const publicKey = env.get('JWT_PUBLIC_KEY');
				const secretKey = env.get('JWT_SECRET_KEY');
				return {
					privateKey: Buffer.from(secretKey, 'base64'),
					publicKey: Buffer.from(publicKey, 'base64'),
					signOptions: { algorithm: 'RS256' }
				};
			}, 
		})
	],
	providers: [JwtStrategy,
		{
			provide: APP_GUARD,
			useValue: JwtAuthGuard
		},
		EnvService
	]
})
export class AuthModule{}