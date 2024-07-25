/* eslint-disable prettier/prettier */
/* eslint-disable quote-props */
export const orderEmailScehma = {
  type: 'record',
  name: 'order_email_schema',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'firstName', type: 'string' },
    { name: 'total', type: 'double' },
    {
      name: 'items',
      type: {
        type: 'array',
        items: {
          type: 'record',
          fields: [
            {
              name: 'product_name',
              type: 'string',
            },
            { name: 'quantity', type: 'int' },
          ],
        },
      },
    },
  ],
};
