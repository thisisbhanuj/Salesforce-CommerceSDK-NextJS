import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './kafka-consumer/kafka-consumer.service';

@Module({
  imports: [],
  controllers: [],
  providers: [KafkaConsumerService],
})
export class AppModule {}
