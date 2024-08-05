import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { kafka, registry } from '@/kafka/kafka';

interface OrderEmailRequestBody {
  data: {
    id: string;
    email: string;
    firstName: string;
    total: number;
    items: {
      product: {
        name: string;
      };
      quantity: number;
    }[];
  };
  kafka_topic: string;
  schema_registry_subject: string;
}

/**
 * Edge Runtime function that sends a message to a Kafka topic using the KafkaJS.
 * @param {NextFetchEvent} event
 * @returns {Promise<status, error>}
 */
export async function POST(request: NextRequest) {
  const { data, kafka_topic, schema_registry_subject } =
    (await request.json()) as OrderEmailRequestBody;

  try {
    const producer = kafka.producer();
    await producer.connect();

    const schemaId = await registry.getLatestSchemaId(
      schema_registry_subject ?? process.env.KAFKA_REGISTRY_ORDERS_SUBJECT,
    );
    const encodedValue = await registry.encode(schemaId, JSON.stringify(data));

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
