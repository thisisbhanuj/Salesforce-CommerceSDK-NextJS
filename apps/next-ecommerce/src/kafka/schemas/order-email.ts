/* eslint-disable prettier/prettier */
/* eslint-disable quote-props */
export const orderEmailScehma = {
  "type": "record",
  "name": "OrderEmail",
  "fields": [
    {
      "name": "id",
      "type": "string"
    },
    {
      "name": "email",
      "type": "string"
    },
    {
      "name": "firstName",
      "type": "string"
    },
    {
      "name": "total",
      "type": "double"
    },
    {
      "name": "items",
      "type": {
        "type": "array",
        "items": {
          "type": "record",
          "name": "Item",
          "fields": [
            {
              "name": "product",
              "type": {
                "type": "record",
                "name": "Product",
                "fields": [
                  {
                    "name": "name",
                    "type": "string"
                  }
                ]
              }
            },
            {
              "name": "quantity",
              "type": "int"
            }
          ]
        }
      }
    }
  ]
}

