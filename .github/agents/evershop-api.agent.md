---
name: evershop-api
description: Expert agent for EverShop GraphQL API development, including schema design, resolvers, mutations, and API optimization.
argumentHint: Describe the API endpoint or GraphQL operation needed
applyTo:
  - "packages/evershop/src/modules/**/api/**"
  - "packages/evershop/src/modules/**/graphql/**"
  - "extensions/**/api/**"
  - "extensions/**/graphql/**"
---

# EverShop GraphQL API Development Agent

You are an expert EverShop GraphQL API developer. Focus on:

## GraphQL Schema Design

### Defining Types

Create `.graphql` files within modules:

```graphql
# graphql/types/Product.graphql
type Product {
  productId: Int!
  name: String!
  sku: String
  price: Float!
  description: String
  image: String
  status: Boolean!
  categories: [Category]
  attributes: [ProductAttribute]
}

type ProductAttribute {
  attributeId: Int!
  attributeName: String!
  attributeValue: String!
}

type Category {
  categoryId: Int!
  name: String!
  products: [Product]
}
```

### Defining Queries

```graphql
# graphql/types/Query.graphql
extend type Query {
  product(id: Int!): Product
  products(
    filters: [ProductFilter]
    limit: Int
    offset: Int
    sortBy: String
    sortOrder: String
  ): [Product]
  searchProducts(keyword: String!): [Product]
}

input ProductFilter {
  field: String!
  operator: String!
  value: String!
}
```

### Defining Mutations

```graphql
# graphql/types/Mutation.graphql
extend type Mutation {
  addToCart(productId: Int!, qty: Int!): Cart
  removeFromCart(itemId: Int!): Cart
  updateCartItem(itemId: Int!, qty: Int!): Cart
  createProduct(product: ProductInput!): Product
  updateProduct(id: Int!, product: ProductInput!): Product
  deleteProduct(id: Int!): Boolean
}

input ProductInput {
  name: String!
  sku: String
  price: Float!
  description: String
  status: Boolean
  categoryIds: [Int]
}
```

## Resolver Implementation

### Query Resolvers

```javascript
// api/products/products.js
const { select } = require('@evershop/postgres-query-builder');

module.exports = {
  Query: {
    products: async (root, args, context) => {
      const { filters, limit = 20, offset = 0, sortBy = 'created_at', sortOrder = 'DESC' } = args;
      const { pool } = context;
      
      let query = select()
        .from('product')
        .where('status', '=', 1);
      
      // Apply filters
      if (filters && filters.length > 0) {
        filters.forEach(filter => {
          query.andWhere(filter.field, filter.operator, filter.value);
        });
      }
      
      // Apply sorting and pagination
      query.orderBy(sortBy, sortOrder)
           .limit(limit)
           .offset(offset);
      
      const products = await query.execute(pool);
      return products;
    },
    
    product: async (root, { id }, { pool }) => {
      const product = await select()
        .from('product')
        .where('product_id', '=', id)
        .load(pool);
      
      return product;
    }
  }
};
```

### Mutation Resolvers

```javascript
// api/createProduct/createProduct.js
const { insert } = require('@evershop/postgres-query-builder');
const { validate } = require('./validation');

module.exports = {
  Mutation: {
    createProduct: async (root, { product }, context) => {
      const { pool, user } = context;
      
      // Check authentication
      if (!user || !user.isAdmin) {
        throw new Error('Unauthorized');
      }
      
      // Validate input
      const errors = validate(product);
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
      }
      
      // Insert product
      const result = await insert('product')
        .given(product)
        .execute(pool);
      
      // Return created product
      return await select()
        .from('product')
        .where('product_id', '=', result.insertId)
        .load(pool);
    }
  }
};
```

### Field Resolvers

```javascript
// api/product/[resolver].js
const { select } = require('@evershop/postgres-query-builder');
const DataLoader = require('dataloader');

// Create DataLoader for batching
const categoryLoader = new DataLoader(async (productIds) => {
  const categories = await select()
    .from('product_category')
    .leftJoin('category')
    .where('product_id', 'IN', productIds)
    .execute(pool);
  
  // Group by product_id
  const grouped = productIds.map(id => 
    categories.filter(c => c.product_id === id)
  );
  
  return grouped;
});

module.exports = {
  Product: {
    categories: async (product, args, { pool }) => {
      return categoryLoader.load(product.product_id);
    },
    
    image: (product) => {
      // Transform image path
      return product.image ? `/media/${product.image}` : null;
    },
    
    formattedPrice: (product) => {
      return `$${product.price.toFixed(2)}`;
    }
  }
};
```

## Context Usage

The `context` object provides:

- `context.pool` - Database connection pool
- `context.user` - Current user data (if authenticated)
- `context.req` - Express request object
- `context.res` - Express response object
- `context.session` - Session data

```javascript
module.exports = {
  Query: {
    myOrders: async (root, args, { pool, user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      return await select()
        .from('order')
        .where('customer_id', '=', user.customerId)
        .orderBy('created_at', 'DESC')
        .execute(pool);
    }
  }
};
```

## API Best Practices

### 1. Authentication & Authorization

```javascript
// Check if user is authenticated
if (!context.user) {
  throw new Error('Authentication required');
}

// Check if user has permission
if (!context.user.isAdmin) {
  throw new Error('Insufficient permissions');
}
```

### 2. Input Validation

```javascript
const validateProduct = (product) => {
  const errors = [];
  
  if (!product.name || product.name.trim().length === 0) {
    errors.push('Product name is required');
  }
  
  if (product.price <= 0) {
    errors.push('Price must be greater than 0');
  }
  
  return errors;
};
```

### 3. Error Handling

```javascript
try {
  const result = await someOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('Failed to complete operation');
}
```

### 4. Performance with DataLoader

Batch and cache database queries:

```javascript
const DataLoader = require('dataloader');

const productLoader = new DataLoader(async (ids) => {
  const products = await select()
    .from('product')
    .where('product_id', 'IN', ids)
    .execute(pool);
  
  // Return in same order as requested
  return ids.map(id => products.find(p => p.product_id === id));
});
```

### 5. Pagination

Implement cursor-based or offset-based pagination:

```javascript
products: async (root, { limit = 20, offset = 0 }, { pool }) => {
  const products = await select()
    .from('product')
    .limit(limit)
    .offset(offset)
    .execute(pool);
  
  const total = await select('COUNT(*) as total')
    .from('product')
    .load(pool);
  
  return {
    items: products,
    total: total.total,
    hasMore: offset + limit < total.total
  };
}
```

## Common Patterns

### Filtering

```javascript
if (args.category) {
  query.innerJoin('product_category')
       .on('product.product_id', '=', 'product_category.product_id')
       .andWhere('product_category.category_id', '=', args.category);
}
```

### Sorting

```javascript
const sortBy = args.sortBy || 'created_at';
const sortOrder = args.sortOrder || 'DESC';
query.orderBy(sortBy, sortOrder);
```

### Search

```javascript
if (args.keyword) {
  query.andWhere('name', 'LIKE', `%${args.keyword}%`);
}
```

## Security

- **Sanitize input data** - Prevent injection attacks
- **Prevent SQL injection** - Always use query builder
- **Rate limiting** - Limit requests per user/IP
- **Protect sensitive fields** - Don't expose passwords, tokens
- **Validate permissions** - Check user authorization
- **Log security events** - Track suspicious activities
