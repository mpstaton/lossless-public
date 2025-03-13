PromptQL: A Data Access Agent for business data
===============

[![Image 1: PromptQL](https://res.cloudinary.com/dh8fp23nd/image/upload/v1730382413/website%20v3/Homepage/Group_2609229_wlins5.svg)](https://promptql.hasura.io/)

[Docs](https://promptql.hasura.io/docs)

[Sign in](https://promptql.console.hasura.io/?pg=promptql&plcmt=header&cta=sign-up-now)

PromptQL
========

A data access agent with [out-of-the-box connectors](https://promptql.hasura.io/#canned-search-retrieval) and [agentic query planning](https://promptql.hasura.io/#agentic-approach).

[Try Now](https://promptql.hasura.io/docs)[Contact Us](https://hasura.io/book-demo/promptql)

5x better with business data
----------------------------

A PromptQL agent is over 5x better than a traditional "in-context" methods.

*   Accuracy
*   Repeatability

  
PromptQL provides an unprecedented level of accuracy and repeatability for real-world tasks.

[PromptQL design & benchmark](https://promptql.hasura.io/spec)

Tool calling (Claude + MCP)

PromptQL

PromptQL Features
-----------------

Query Plans

Connectors

Computation

Actions

Memory

Explainability

Authorization

### Dynamic Query Planning

PromptQL builds a dynamic query plan that can be modified during execution based on intermediate results or explicit instructions from the user. It incorporates control structures (e.g., if-else statements) to handle different scenarios.

This overcomes a rigid retrieval based approach on precomputed embeddings, similarity search, predefined tools, etc, lacking the ability to adjust retrieval strategies dynamically.

Find all products that had declining sales for three consecutive months, and if none, expand the search to products with declining sales for two months.

#### Query plan

*   Search for products with sales decline over three months.
*   Check Results: If none found, adjust criteria.
*   Modify the query to search for two months.
*   Provide the list of products.

#### Executed

### Connectors to Any Kind of Data

DDN provides connectors to seamlessly integrate with any data sources, allowing AI models to access and interact with all your data under a unified schema.

**Problem:** Traditional RAG systems struggle to integrate data from diverse sources such as SQL databases, NoSQL stores, APIs, and SaaS platforms.

Generate a report of our top 10 customers by ARR, including their purchase history, support tickets, and recent interactions.

#### Query plan

*   Identify the top 10 customers by ARR using invoice data \[in BigQuery\]
*   Retrieve customer purchase history for each customer \[from PostgreSQL\]
*   Fetch support ticket data for each customer \[from Zendesk API\]
*   Obtain recent interaction records for each customer \[from Salesforce API\]
*   Combine information from all sources.
*   Present the consolidated data as a table.

#### Executed

### Computation

PromptQL has a programmatic runtime environment that allows AI to execute complex computations, data transformations, and statistical analyses. PromptQL handles large datasets by processing data in batches outside the LLM's context window. It can call another LLM within the runtime to analyze text data.

Calculate the average customer lifetime value (CLTV) segmented by marketing channel for the past year.

#### Query plan

*   Gather purchase histories for each customer.
*   Group customers by marketing channels.
*   Calculate average CLTV per segment.
*   Provide the computed values.

#### Executed

### Actions & Mutations

PromptQL enables AI to perform actions and mutations by executing commands that can update data, call APIs, or invoke functions, allowing for end-to-end task completion.

**Problem:** Many AI applications are limited to data retrieval and cannot perform actions or mutations, such as updating records or triggering workflows.

For customers with overdue invoices exceeding $10,000, send a payment reminder email and flag their account as 'At Risk'.

#### Query plan

*   Identify customers that meet the criteria.
*   Update their records in Salesforce.
*   Fetch additional information about each customer.
*   Write and send reminder emails.

#### Executed

### Structured Memory

**Problem:** LLMs have limited context windows, making it difficult to handle large datasets or maintain conversation context over long interactions, leading to potential loss of information and hallucinations.

**Solution:** PromptQL uses memory artifacts to store and retrieve information outside the LLM's context window. This ensures consistency, accuracy, and the ability to handle large-scale data without overloading the LLM.

Based on the sales performance report we discussed earlier, project next quarter's sales based on the same growth rate.

#### Query plan

*   Retrieve previously generated report from the stored memory artifact.
*   Compute future sales.
*   Present summary and projections.

#### Executed

### Explainability

**Problem:** RAG systems operate like black boxes. When an AI model retrieves information to generate a response, it can’t provide insights into how or why specific data was selected. It is difficult to verify the sources or reasoning behind the LLM's answers.

**Solution:** PromptQL provides detailed execution plans and can be explicitly asked to explain each step.

Explain your method to generate the projections

#### PromptQL

I checked the memory artifacts for the history of the referenced sales report. Then I extracted the latest sales data and current growth rate pattern from the data. Then I calculated the next quarter projection using the existing growth rate and validated the projection against historical trends. Finally I presented the results with key assumptions

### Fine-Grained Authorization

**Problem:** RAG lacks built-in mechanisms for enforcing data access permissions and security protocols. There is always the potential risk of exposure of sensitive data. It cannot tailor data access based on user roles or credentials.

**Solution:** Hasura DDN integrates fine-grained, role-based access control directly into the data querying process, ensuring that all data access adheres to predefined authorization policies at row, column, and object levels.

Provide me with the sales data for all the regions for the past month. \[As a regional manager\]

#### PromptQL

You are the regional manager for the state of California, and hence I can only provide the information from your region. Here is the latest sales data over the past month for California.

#### Sales data for last month

PromptQL Demo Gallery
---------------------

![Image 2: PromptQL GitHub Demo](https://res.cloudinary.com/dh8fp23nd/image/upload/v1731607098/img_ai_assistant_tgvrqz.png)

### AI assistant for engineering teams using GitHub

This Engineering Management AI Assistant lets you explore your GitHub repositories and issues with a natural language interface.

[GitHub Repo](https://github.com/hasura/example-promptql-github)[Docs](https://promptql.hasura.io/docs/getting-started)

![Image 3: PromptQL: Customer Support Assistant](https://res.cloudinary.com/dh8fp23nd/image/upload/v1731607098/img_zendesk_bwdr68.png)

### Customer Support Assistant connected to Zendesk and PostgreSQL

The Customer Support Assistant is a PromptQL powered AI assistant that helps you to explore data from customer data from PostgreSQL and support ticket data from Zendesk all via natural language.

[Docs](https://promptql.hasura.io/docs)

![Image 4: PromptQL: E-Commerce Demo](https://res.cloudinary.com/dh8fp23nd/image/upload/v1731607098/img_ecommerce_mdc4hg.png)

### Ecommerce App Search Assistant connected to PostgreSQL and TypeScript

Explore products, orders and customers data from an e-commerce app using natural language queries. Connected to PostgreSQL and TypeScript.

[GitHub Repo](https://github.com/hasura/promptql-sample-ecommerce-app)[Docs](https://promptql.hasura.io/docs)

Build with us: AI solutions on your data
----------------------------------------

Have a use case for PromptQL and Agentic Data Access? Interested in evaluating your existing AI agents / assistants against the ADAB? Let's connect!  
  
We would love to collaborate with you to build your first agent - for free.

[Contact Us](https://hasura.io/book-demo/promptql)

Get started with PromptQL
-------------------------

### 1Connect your data

### 2Add your LLM API key

### 3Build with AI

[Try now](https://promptql.hasura.io/docs)

[![Image 5: hasura.io and promptql](https://res.cloudinary.com/dh8fp23nd/image/upload/v1730382412/website%20v3/Homepage/Frame_2610608_k7dsic.svg)](https://hasura.io/)

© Copyright Hasura, Inc. All Rights Reserved.

![Image 6: AICPA](https://res.cloudinary.com/dh8fp23nd/image/upload/v1729950108/v3-website/prompt-ql/aicpa_ugn2zz.png)![Image 7: HIPAA](https://res.cloudinary.com/dh8fp23nd/image/upload/v1729950108/v3-website/prompt-ql/hipaa_zwiq6k.png)![Image 8: ISO](https://res.cloudinary.com/dh8fp23nd/image/upload/v1729950108/v3-website/prompt-ql/iso_o9zxml.png)

 0 

\[cky\_video\_placeholder\_title\]

\[cky\_video\_placeholder\_title\]

Links/Buttons:
- [](https://hasura.io/)
- [Docs](https://promptql.hasura.io/docs/getting-started)
- [Sign in](https://promptql.console.hasura.io/?pg=promptql&plcmt=header&cta=sign-up-now)
- [out-of-the-box connectors](https://promptql.hasura.io/#canned-search-retrieval)
- [agentic query planning](https://promptql.hasura.io/#agentic-approach)
- [Contact Us](https://hasura.io/book-demo/promptql)
- [PromptQL design & benchmark](https://promptql.hasura.io/spec)
- [GitHub Repo](https://github.com/hasura/promptql-sample-ecommerce-app)
