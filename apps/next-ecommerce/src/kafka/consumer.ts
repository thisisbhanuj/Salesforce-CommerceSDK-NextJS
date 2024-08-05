import { kafka, registry } from './kafka';
import consumerConfiguration from './ConsumerConfiguration';
import { KafkaConsumerConfig } from '@/kafkaType';
import { KafkaJSError } from 'kafkajs';

export default async function kafkaConsumer(config: KafkaConsumerConfig) {
  const consumer = kafka.consumer({ groupId: config.groupId });

  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: config.topic,
      fromBeginning: true,
    });

    console.log('kafkaConsumer : Consumer connected and subscribed to topic');

    const messages = [] as unknown[];
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
              `kafkaConsumer : No processing function found for topic: ${config.topic}`,
            );
            return;
          }
          await configuration.processor(decodedValue);

          messages.push({ orderId: decodedValue.id, status: 'email sent' });
          console.log(
            'kafkaConsumer : Order Confirmation Email sent for :',
            decodedValue.id,
          );
        } catch (decodeError) {
          console.error('kafkaConsumer : Error decoding message:', decodeError);
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
    console.error('kafkaConsumer : Consumer error:', error);

    // Handle rebalancing error
    if (
      (error as KafkaJSError)?.message?.includes('The group is rebalancing')
    ) {
      console.warn('kafkaConsumer : Rebalancing detected. Rejoining...');
      await consumer.disconnect();
      await consumer.connect();
      return kafkaConsumer(config); // Re-run the consumer
    }

    return { status: 'error', error };
  }
}
