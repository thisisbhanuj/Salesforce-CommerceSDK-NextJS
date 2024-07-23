import { kafkaProducer as upstashProducer } from '@/upstash/kafka/upstashProducer';
import { NextFetchEvent, NextRequest } from 'next/server';
import { RestApiClient } from '@/utility/restApiClient';

/**
 * The provider is a function that returns a Kafka producer.
 * The Kafka producer is a function that sends a message to a Kafka topic.
 * The Kafka topic is a string that represents the name of the topic.
 * The message is an object that contains the value of the message.
 * The value is a string that represents the message.
 */
export default function kafkaProvider(req: NextRequest, event: NextFetchEvent) {
  return {
    _name: 'kafka',
    /**
     * The edge serverless function that sends a message to a Kafka topic using Upstash.
     * Only work for Edge runtime.
     * @returns {Promise<status, error>}
     */
    _edge_serverless: () => {
      return upstashProducer(req, event);
    },
    /**
     * The node serverless function that sends a message to a Kafka topic using the KafkaJS.
     * Instead of calling kafkaProducer, trigger the Edge Function using Next.js API routes.
     * We can make a fetch request to the API route from the middleware to produce messages.
     *
     * https://nextjs.org/docs/messages/edge-dynamic-code-evaluation
     *
     * @param {string} topic
     * @returns {Promise<message>}
     */
    _node_serverless: (topic: string) => {
      const body = { params: { ...req.body }, kafka_topic: topic };
      return RestApiClient.post(`/kafka/produce`, body);
    },
  };
}
