import { Injectable } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';

import { orderConfirmationEmail } from '@repo/ecommerce/src/utility/emailHelper';

@Injectable()
export class KafkaConsumerService {
  private kafka: Kafka;
  private schemaRegistry: SchemaRegistry;

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKER],
      ssl: true,
      sasl: {
        mechanism: 'scram-sha-256',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
      },
      logLevel: logLevel.ERROR,
    });
    this.schemaRegistry = new SchemaRegistry({
      host: process.env.KAFKA_REGISTRY_URL,
    });
  }

  async consume() {
    const consumer = this.kafka.consumer({
      groupId: process.env.KAFKA_GROUP_ID,
    });

    await consumer.connect();
    await consumer.subscribe({
      topic: process.env.KAFKA_ORDER_TOPIC,
      fromBeginning: true,
    });

    const schemaId = await this.schemaRegistry.getLatestSchemaId(
      process.env.KAFKA_REGISTRY_ORDERS_SUBJECT,
    );

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (process.env.KAFKA_ORDER_TOPIC === topic) {
          try {
            const value = JSON.parse(message.value.toString());

            console.debug(`Received message: ${JSON.stringify(value.payload)}`);
            console.debug(
              `Schema: ${schemaId} : Topic: ${topic} : Partition: ${partition}`,
            );

            const decodedValue = await this.schemaRegistry.decode(
              message.value,
            );

            console.debug(`Decoded value: ${JSON.stringify(decodedValue)}`);

            await orderConfirmationEmail(decodedValue);
          } catch (error) {
            console.error('Error decoding message:', error);
          }
        } else {
          console.warn(`Received message from unknown topic: ${topic}`);
        }
      },
    });

    process.on('SIGINT', async () => {
      await consumer.disconnect();
    });
  }
}
