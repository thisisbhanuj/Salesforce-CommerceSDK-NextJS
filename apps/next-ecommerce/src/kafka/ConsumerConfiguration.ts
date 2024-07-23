import { ConsumerConfiguration, OrderEmail } from '@/kafkaType';
import { orderConfirmationEmail } from '@/utility/emailHelper';

/**
 * The configuration object for the Kafka consumer.
 * This defines processing logic for various topics.
 */
const consumerConfiguration: ConsumerConfiguration = {
  'order-confirmation': {
    groupId: 'order-group',
    topic: 'order-topic',
    processor: async (data: OrderEmail) => {
      return await orderConfirmationEmail(data);
    },
  },
};

export default consumerConfiguration;
