import { Kafka } from 'kafkajs';
import { SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry';

export const kafka = new Kafka({
  clientId: 'ecommerce',
  brokers: [process.env.KAFKA_BROKER as string],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME as string,
    password: process.env.KAFKA_PASSWORD as string,
  },
});

export const registry = new SchemaRegistry({
  host: process.env.KAFKA_REGISTRY_URL as string,
});

export async function registerSchema(schema: string) {
  return await registry.register({
    type: SchemaType.AVRO,
    schema,
  });
};
