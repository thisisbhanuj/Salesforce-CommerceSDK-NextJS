import { findIP } from '@/utility/network';
import { Kafka } from '@upstash/kafka';
import { NextFetchEvent, NextRequest } from 'next/server';

/**
 * The function that sends a message to a Kafka topic using Upstash.
 * @returns {Promise<status, error>}
 */
export async function kafkaProducer(req: NextRequest, event: NextFetchEvent) {
  try {
    if (
      process.env.UPSTASH_KAFKA_REST_ENDPOINT &&
      process.env.UPSTASH_KAFKA_REST_USERNAME &&
      process.env.UPSTASH_KAFKA_REST_PASSWORD &&
      process.env.UPSTASH_KAFKA_TOPIC
    ) {
      const kafka = new Kafka({
        url: process.env.UPSTASH_KAFKA_REST_ENDPOINT,
        username: process.env.UPSTASH_KAFKA_REST_USERNAME,
        password: process.env.UPSTASH_KAFKA_REST_PASSWORD,
      });

      const message = {
        country: req.geo?.country,
        city: req.geo?.city,
        region: req.geo?.region,
        url: req.url,
        ip: findIP(req),
        mobile: req.headers.get('sec-ch-ua-mobile'),
        platform: req.headers.get('sec-ch-ua-platform'),
        useragent: req.headers.get('user-agent'),
      };

      event.waitUntil(
        kafka
          .producer()
          .produce(process.env.UPSTASH_KAFKA_TOPIC, JSON.stringify(message)),
      );

      return { status: 'success' };
    }
  } catch (error) {
    console.error(error);
    return { status: 'error', error };
  }
}
