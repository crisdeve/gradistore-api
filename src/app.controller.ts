import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {
    //console.log(process.env.PORT);
    //console.log(this.configService.get('port'));
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
