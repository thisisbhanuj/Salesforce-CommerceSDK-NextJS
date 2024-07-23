/*
 * Kafka types.
 */

/*
 * Interface for the Kafka consumer configuration
 */
export interface ConsumerConfiguration {
  [key: string]: {
    groupId: string;
    topic: string;
    processor: (data: any) => Promise<unknown>;
  };
}

/**
 * Interface for the Kafka consumer configuration for a specific topic.
 */
export type KafkaConsumerConfig = {
  key: string;
  groupId: string;
  topic: string;
};

/**
 * Interface for the order confirmation email data.
 */
export interface OrderEmail {
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
}
