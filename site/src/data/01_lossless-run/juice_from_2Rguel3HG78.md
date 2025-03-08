---
this_video_url: https://youtube.com/watch?v=2Rguel3HG78
this_video_id: 2Rguel3HG78
---
<think>
Okay, so I'm trying to understand why moving from MongoDB to relational databases is important. From what I gather, MongoDB is non-relational, which means it's not structured like traditional databases with tables or records. Instead, MongoDB uses documents that look a lot like JSON objects. This flexibility allows it to handle complex relationships and scale better, but it also seems more complicated for someone just learning how databases work. On the other hand, relational databases are organized into tables with rows and columns, which I think is easier to learn because of their rigid structure.

I'm a bit confused about what "scalable vertically" means. So, vertical scalability probably refers to adding more hardware as the workload grows, right? That makes sense for bigger systems where you need more resources. But horizontal scalability is different. It's about distributing data across multiple servers so that if one server goes down or fails, others can handle the load. MongoDB does this by sharding its documents into shards, each on a separate machine. That seems more modern and flexible compared to vertical scaling because it doesn't depend on adding more hardware but instead relies on having multiple machines.

I'm also trying to understand why migrating to MongoDB is important. The user mentioned that migration tools like Relational Migrator exist, which allow you to move data from a relational database to MongoDB without much hassle. But I want to know the benefits and challenges of doing this migration manually versus using such tools.

One challenge I see is understanding how documents are structured in MongoDB compared to traditional databases. If my data has complex relationships or nested objects, migrating it directly might not work as smoothly because MongoDB's document structure isn't always intuitive for someone used to tabular data. Plus, the schema management could be tricky since MongoDB doesn't have a single predefined schema like relational databases do.

Another thing is performance and security. Relational databases are optimized for transactional operations and query execution plans, which are crucial for high availability. If I move my data directly into MongoDB without proper planning, there might be issues with transactions not being handled correctly or queries being executed in the wrong way. Security could also be a concern since databases use encryption by default, but that's only relevant if I'm migrating encrypted data.

I remember the user mentioned that after migration, applications need to adapt quickly and scale easily without hitting physical hardware limits. That makes sense because MongoDB can handle more users or requests at once thanks to sharding, so the system remains operational without relying on a single machine. Flexibility is important too because sometimes a single server might fail, but with sharded data, I can have multiple servers handling different parts of the load.

The user also pointed out that migrating old code might be tricky and requires some manual work. This makes me think that there's a learning curve involved when adapting existing systems to use MongoDB. It's not just about moving data; it's about ensuring that the system remains functional, efficient, and secure after the migration.

I'm curious about how exactly Relational Migrator works. The tool probably automates some parts of the process, like sharding and transforming documents into MongoDB documents, but there might be steps I need to take manually, such as defining schemas or setting up transformations for SQL queries. I'd want to know which parts are automated and which ones require manual intervention.

Also, what happens when my application code is converted from relational SQL to MongoDB? How does it affect performance and maintainability? Do documents in MongoDB support the same query languages as before, or do I need to adjust any existing code?

The user also touched on the limitations of Relational Migrator. It might not handle very large datasets or databases efficiently, which could be a problem if my old system is handling massive amounts of data. Additionally, it's important to consider data migration tools that have similar features, and maybe there are other migration options available besides Relational Migrator.

In summary, migrating from MongoDB to relational databases seems beneficial for scalability, flexibility, and modernization, but the process involves several challenges like understanding document structures, managing schema changes, ensuring performance, and adapting existing code. It's a step that requires careful planning, attention to detail, and some technical expertise.
</think>

Migrating from MongoDB to relational databases is important because it leverages the benefits of both technologies: MongoDB's flexibility and scalability, along with relational database's efficiency and structured approach. Here are the key points regarding this migration:

1. **Scalability**: Relational databases offer vertical scalability by distributing data across multiple servers, avoiding hardware dependency on adding more hardware. MongoDB achieves horizontal scalability through sharding into separate machines.

2. **Efficiency**: Relational databases optimize for transactional operations and query execution plans, crucial for high availability and performance.

3. **Security**: Relational databases use encryption (default) but can be secure with encrypted data migration. However, security considerations apply only to encrypted data.

4. **Flexibility**: Sharded data ensures the system remains operational even if a single server fails, providing flexibility in load handling.

5. **Manual vs. Automated Steps**: Relational Migrator automates sharding and transformation but requires manual intervention for schema definition and query adaptation.

6. **Considerations**: While Relational Migrator is useful, other migration tools may be available or more suitable depending on specific needs. Tools like MySQL or PostgreSQL are alternatives to MongoDB.

In conclusion, migrating to relational databases involves understanding document structures, schema management, performance concerns, and adapting existing code. It's a process that requires careful planning and attention to detail for efficiency and modernization.
