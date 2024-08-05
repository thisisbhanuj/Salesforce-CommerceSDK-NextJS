import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { kafka, registry } from '@/kafka/kafka';

interface RequestBody {
  params: Record<string, string>;
  kafka_topic: string;
}

/**
 * Edge Runtime function that sends a message to a Kafka topic using the KafkaJS SDK
 * @param {NextFetchEvent} event
 * @returns {Promise<status, error>}
 */
export async function POST(request: NextRequest) {
  const { params, kafka_topic } = (await request.json()) as RequestBody;
  const producer = kafka.producer();
  await producer.connect();

  try {
    const schemaId = await registry.getLatestSchemaId(
      process.env.UPSTASH_KAFKA_REGISTRY_ANALYTICS_SUBJECT as string,
    );
    const encodedValue = await registry.encode(
      schemaId,
      JSON.stringify(params),
    );

    await producer.send({
      topic: kafka_topic,
      messages: [{ value: encodedValue }],
    });

    await producer.disconnect();
    return NextResponse.json(
      { message: 'success' },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'error' },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
