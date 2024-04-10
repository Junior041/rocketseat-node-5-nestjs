import { Module } from '@nestjs/common';
import { Encrypter } from '@/domain/notification/application/cryptography/encrypter';
import { JwtEncrypter } from './jwt-encrypter';
import { HashComparer } from '@/domain/notification/application/cryptography/hash-comparer';
import { BcryptHasher } from './bcrypt-hasher';
import { HashGenerator } from '@/domain/notification/application/cryptography/hash-generator';

@Module({
	providers: [
		{
			provide: Encrypter,
			useClass: JwtEncrypter
		},
		{
			provide: HashComparer,
			useClass: BcryptHasher
		},
		{
			provide: HashGenerator,
			useClass: BcryptHasher
		},
	],
	exports: [
		Encrypter,
		HashComparer,
		HashGenerator,
	]
})
export class CryptographyModule{}