import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { KafkaConsumerConfig } from '@/kafkaType';
import kafkaConsumer from '@/kafka/consumer';

let isConsumerRunning = false;

export async function POST(request: NextRequest) {
  const { groupId, key, topic } = (await request.json()) as KafkaConsumerConfig;

  if (!isConsumerRunning) {
    isConsumerRunning = true;
    kafkaConsumer({ groupId, key, topic })
      .then(() => {
        isConsumerRunning = false;
      })
      .catch((error) => {
        console.error('Kafka consumer encountered an error:', error);
        isConsumerRunning = false;
      });
  }

  return NextResponse.json(
    { message: 'consumer started' },
    { status: HttpStatusCode.Ok },
  );
}
