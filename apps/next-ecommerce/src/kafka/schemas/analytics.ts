export const analytics = {
  type: 'record',
  name: 'web_analytics',
  namespace: 'com.upstash.avro',
  fields: [
    { name: 'country', type: 'string' },
    { name: 'city', type: 'string' },
    { name: 'region', type: 'string' },
    { name: 'url', type: 'string' },
    { name: 'ip', type: 'string' },
    { name: 'mobile', type: 'boolean' },
    { name: 'platform', type: 'string' },
    { name: 'useragent', type: 'string' },
  ],
};
