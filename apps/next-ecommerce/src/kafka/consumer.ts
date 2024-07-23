import { kafka, registry } from './kafka';
import consumerConfiguration from './ConsumerConfiguration';
import { KafkaConsumerConfig } from '@/kafkaType';

/**
 * NodeJS Serverless Function that consumes messages from a Kafka topic using the KafkaJS.
 * It processes messages based on the provided configuration.
 *
 * @param config - The configuration object for the Kafka consumer, specifying the key, group ID, and topic.
 * @returns {Promise<{ status: string; messages?: unknown[]; error?: any }>}
 *  - A promise that resolves to an object with status (`success` or `error`),
 *    messages (array of processed messages - optional for success), and error (optional for error).
 */
export default async function kafkaConsumer(config: KafkaConsumerConfig) {
  const consumer = kafka.consumer({ groupId: config.groupId });
  await consumer.connect();
  await consumer.subscribe({
    topic: config.topic,
    fromBeginning: true,
  });

  const messages = [] as unknown[];

  try {
    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const decodedValue = await registry.decode(message.value as Buffer);

          const configuration =
            consumerConfiguration[
              config.key as keyof typeof consumerConfiguration
            ];
          if (!configuration) {
            console.warn(
              `No processing function found for topic: ${config.topic}`,
            );
            return;
          }
          await configuration.processor(decodedValue);
          messages.push({ message: decodedValue, status: 'success' });

        } catch (decodeError) {
          console.error('Error decoding message:', decodeError);
        }
      },
    });

    setTimeout(async () => {
      await consumer.disconnect();
      return {
        status: 'success',
        messages: messages,
      };
    }, 5000); // Adjust the timeout as needed to fetch messages
  } catch (error) {
    console.error('Consumer error:', error);
    return { status: 'error', error };
  }
}
