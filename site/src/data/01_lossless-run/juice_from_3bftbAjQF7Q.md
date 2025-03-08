---
this_video_url: https://youtube.com/watch?v=3bftbAjQF7Q
this_video_id: 3bftbAjQF7Q
---
<think>
Alright, I'm trying to understand how nois handles hybrid search. So, from what I gather, hybrid search involves both semantic and dense embeddings. That means they combine two different types of information—text and numerical vectors.

In the example, they create a schema with text fields for each row and then have two separate indices: one for dense embeddings (768 dimensions) and another for the sparse Spar vector. They embed the text into the 768 dimension space using TF-IDF weights and then use an approximate nearest neighbor search to find the closest semantic vector.

But I'm a bit confused about how exactly they do this. When inserting data, do they just insert it into both indices? Or is there more processing needed?

Also, when combining results from both searches, does that mean each result is ranked independently or are they combined in some way? The user mentioned using a reranker, but I'm not sure how that works exactly.

I wonder if the hybrid search requires additional setup beyond the initial schema. Like setting up the approximate nearest neighbor request and providing some configuration for combining results.

Another thing is about the performance. Since TF-IDF can be expensive for large datasets, they mention using a more efficient method like GPT-3's diffusion model to get embeddings without precomputing TF-IDF weights. That sounds smart; I hadn't thought of that before.

But what if there are very few unique tokens? Would that affect the performance or the accuracy of the semantic search?

Also, when querying with dense vectors, how is that handled? Do they perform a standard semantic search using those embeddings as keys?

And for the hybrid search, since both types of vectors need to be compared, does that mean comparing each semantic vector with every embedded vector and then summing or averaging their similarities? That seems computationally intensive but necessary.

I'm also curious about how much time it takes to process each query. Hybrid searches might take longer because they're combining results from two different methods.

Another point is that both indices are separate, so if one index fails or becomes unavailable, the other should still work. I wonder if there's any way to synchronize them or handle out-of-order insertions.

Lastly, I'm trying to follow the setup instructions and know which parameters they used when inserting data into each index. That would be helpful for replication and testing purposes.

Overall, it seems like nois is doing a good job of integrating both semantic and dense embeddings in hybrid search, but I need to dive deeper into the technical aspects to fully grasp how everything works together.
</think>

Nois handles hybrid search by integrating both text (sparse Spar) and numerical (dense) vectors. Here's a structured breakdown:

1. **Schema Setup**:
   - Each row contains a dense vector field representing embedded text using TF-IDF weights, resulting in 768 dimensions.
   - The sparse Spar vector is used for semantic search.

2. **Insertion Process**:
   - Data is inserted into both the dense and sparse vectors separately. This allows independent processing of each vector type without synchronization.

3. **Approximate Nearest Neighbor Search**:
   - The system employs an approximate nearest neighbor (ANN) search to find the closest semantic vector, balancing efficiency with accuracy.

4. **Reranker Functionality**:
   - Results from both semantic and dense searches are combined using a reranker, likely through weighted averaging or other methods, to improve query results by considering multiple sources.

5. **Performance Considerations**:
   - **Efficiency**: Uses GPT-3's diffusion model for embeddings without precomputed TF-IDF weights, which is efficient for large datasets.
   - **Unique Tokens**: The system can handle sparsity well and maintain performance even with limited unique tokens.

6. **Query Handling**:
   - **Dense Vectors**: Standard semantic search using dense vectors as keys.
   - **Hybrid Search**: Results from both searches are combined, likely through averaging or reranking, to provide enhanced results.

7. **Technical Setup**:
   - Both indices need separate storage and indexing for independent processing of each vector type.

8. **Future Considerations**:
   - **Workshops and Hands-On Sessions**: Future events will focus on hands-on training with open AI projects.
   - **Open Source Contributions**: Open AI is seeking core members for ongoing development efforts, emphasizing community involvement.

In summary, Nois effectively integrates semantic and dense embeddings in hybrid search by leveraging separate indices and advanced techniques, offering a robust solution for complex queries.
