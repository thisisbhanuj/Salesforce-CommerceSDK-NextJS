import { kafka, registry } from '@/kafka/kafka';

/**
 * NodeJS Serverless Function that sends a message to a Kafka topic using the KafkaJS.
 * It cannot be used in the middleware, as it uses the Node.js runtime.
 *
 * https://nextjs.org/docs/messages/edge-dynamic-code-evaluation
 *
 * Next.js middlewares cannot leverage Node.js functionalities directly.
 * Middlewares run in the Edge runtime, which has limitations compared
 * to a traditional Node.js server environment. Functions like kafkaProducer,
 * which likely use Node.js modules like kafkajs, are not compatible in Edge context.
 *
 * @param {string} data - The data to send to the Kafka topic.
 * @param {string} kafka_topic - The Kafka topic to send the message to.
 * @param {string} schema_registry - The schema registry subject to use for encoding the message.
 * @returns {Promise<status, error>}
 */
export async function kafkaProducer(
  data: string,
  kafka_topic: string,
  schema_registry_subject: string,
) {
  const producer = kafka.producer();
  await producer.connect();

  try {
    const schemaId = await registry.getLatestSchemaId(schema_registry_subject);
    const dataBuffer = Buffer.from(data);
    const encodedValue = await registry.encode(schemaId, dataBuffer);

    await producer.send({
      topic: kafka_topic,
      messages: [{ value: encodedValue }],
    });

    await producer.disconnect();
    return { status: 'success' };
  } catch (error) {
    return { status: 'error', error };
  }
}
