import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { GateWayService } from './gateway.service';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [GateWayService],
  exports: [GateWayService],
})
export class GateWayModule {}
