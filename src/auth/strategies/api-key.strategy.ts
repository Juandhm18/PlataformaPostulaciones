// @ts-nocheck
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
    constructor(private configService: ConfigService) {
        // @ts-ignore
        super(
            { header: 'x-api-key', prefix: '' },
            false,
            (apiKey: string, done: any) => this.validate(apiKey, done),
        );
    }

    public validate = (apiKey: string, done: (err: Error | null, user: boolean) => void) => {
        const validApiKey = this.configService.get<string>('API_KEY');
        if (apiKey === validApiKey) {
            done(null, true);
        } else {
            done(new UnauthorizedException('Invalid API Key'), false);
        }
    };
}
