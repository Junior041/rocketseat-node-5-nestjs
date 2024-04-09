import { HashComparer } from '@/domain/notification/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/notification/application/cryptography/hash-generator';
import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
	private HASH_SALT = 8;
	hash(plain: string): Promise<string> {
		return hash(plain, this.HASH_SALT);
	}
	compare(plain: string, hash: string): Promise<boolean> {
		return compare(plain, hash);
	}
    
}