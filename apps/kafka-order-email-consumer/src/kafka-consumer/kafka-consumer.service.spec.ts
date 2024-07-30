import { Test, TestingModule } from '@nestjs/testing';
import { KafkaConsumerService } from './kafka-consumer.service';
import { Kafka, Message, ConsumerConfig } from 'kafkajs';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';

jest.mock('kafkajs', () => ({
  Kafka: jest.fn().mockReturnValue({
    consumer: jest.fn().mockReturnValue({
      run: jest.fn() as any,
    }),
  }),
})); // Mock the Kafka client

jest.mock('@repo/ecommerce/src/utility/emailHelper', () => ({
  orderConfirmationEmail: jest.fn().mockResolvedValue({}), // Mock the email helper
}));

jest.mock('@kafkajs/confluent-schema-registry', () => ({
  SchemaRegistry: jest.fn().mockImplementation(() => ({
    getLatestSchemaId: jest.fn().mockResolvedValue(1), // Mock the schema registry
    decode: jest.fn().mockResolvedValue({}), // Mock the schema decode
  })),
}));

describe('KafkaConsumerService', () => {
  let service: KafkaConsumerService;
  let mockKafka: Kafka;
  let mockSchemaRegistry: SchemaRegistry;
  const config: ConsumerConfig = {
    groupId: 'test-group',
  };

  beforeEach(async () => {
    mockKafka = jest.fn() as any; // Mock the Kafka client
    mockSchemaRegistry = jest.fn() as any; // Mock the schema registry

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaConsumerService,
        {
          provide: Kafka, // Provide a mocked Kafka client
          useValue: mockKafka,
        },
      ],
    }).compile();

    service = module.get<KafkaConsumerService>(KafkaConsumerService);
  });

  it('should consume messages and send confirmation emails', async () => {
    const mockConsumer = { run: jest.fn() } as any; // Mock the consumer instance
    const mockMessage: Message = { value: JSON.stringify({ orderId: 123 }) }; // Mock message data

    mockKafka.consumer = jest.fn().mockReturnValue(mockConsumer); // Mock the consumer creation
    mockKafka.consumer(config).connect = jest.fn(); // Mock the connect method
    mockKafka.consumer(config).subscribe = jest.fn(); // Mock the subscribe method

    await service.consume(); // Call the consume method

    // Simulate successful message processing (replace with actual logic)
    mockConsumer.run.mockImplementationOnce((callback) =>
      callback({ topic: 'order-topic', message: mockMessage }),
    );

    expect(mockSchemaRegistry.getLatestSchemaId).toHaveBeenCalledWith(
      'subject-name',
    ); // Verify schema registry call
    expect(mockSchemaRegistry.decode).toHaveBeenCalled(); // Verify schema decode call
    expect(mockKafka.consumer).toHaveBeenCalledWith(config); // Verify consumer creation
    expect(mockConsumer.run).toHaveBeenCalled(); // Verify consumer run is called
    await new Promise((resolve) => setTimeout(resolve, 10)); // Wait for asynchronous processing
    await expect(service.consume()).resolves.toEqual({}); // Replace with expected result
  });
});
