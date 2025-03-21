Mistral OCR | Mistral AI
===============

[](https://mistral.ai/)

*   Products
*   Solutions
*   Research
*   Resources
*   Company

[Try the API](https://console.mistral.ai/)[Talk to sales](https://mistral.ai/contact)

[](https://mistral.ai/)

Mistral OCR
===========

Introducing the world’s best document understanding API.

Research

Mar 6, 2025

Mistral AI Team

Throughout history, advancements in information abstraction and retrieval have driven human progress. From hieroglyphs to papyri, the printing press to digitization, each leap has made human knowledge more accessible and actionable, fueling further innovation.

Today, we’re at the precipice of the next big leap—to unlock the collective intelligence of all digitized information. Approximately [90%](https://resources.data.gov/glossary/unstructured-data/) of the world’s organizational data is stored as documents, and to harness this potential, we are introducing [Mistral OCR](https://docs.mistral.ai/capabilities/document/).  
  
Mistral OCR is an Optical Character Recognition API that sets a new standard in document understanding. Unlike other models, Mistral OCR comprehends each element of documents—media, text, tables, equations—with unprecedented accuracy and cognition. It takes images and PDFs as input and extracts content in an ordered interleaved text and images.

As a result, Mistral OCR is an ideal model to use in combination with a RAG system taking multimodal documents (such as slides or complex PDFs) as input.

We have made Mistral OCR as the default model for document understanding across millions of users on Le Chat, and are releasing the API _mistral-ocr-latest_ at 1000 pages / $ (and approximately double the pages per dollar with batch inference). The API is available today on our developer suite [la Plateforme](http://console.mistral.ai/), and coming soon to our cloud and inference partners, as well as on-premises.

Highlights
----------

1.  State of the art understanding of complex documents
    
2.  Natively multilingual and multimodal
    
3.  Top-tier benchmarks
    
4.  Fastest in its category
    
5.  Doc-as-prompt, structured output
    
6.  Selectively available to self-host for organizations dealing with highly sensitive or classified information
    

Let’s dive into each.

### State of the art understanding of complex documents

Mistral OCR excels in understanding complex document elements, including interleaved imagery, mathematical expressions, tables, and advanced layouts such as LaTeX formatting. The model enables deeper understanding of rich documents such as scientific papers with charts, graphs, equations and figures.

Below is an example of the model extracting text as well as imagery from a given PDF into a markdown file. You can access the notebook [here](https://colab.research.google.com/github/mistralai/cookbook/blob/main/mistral/ocr/structured_ocr.ipynb).

Below we have side-by-side comparisons of PDFs and their respective OCR's outputs. Hover the slider  to switch between input and output.

Tables + Figures

![Image 1: 3 Exemple](https://cms.mistral.ai/assets/3aa243eb-f883-4676-b23a-f69f5227375c.png?width=1546&height=1999)

OCR result

![Image 2: 3 Ocr](https://cms.mistral.ai/assets/5ec9ef56-c72a-4f6c-bcbc-f2e344909059.png?width=1198&height=1624)

Math

![Image 3: 4 Exemple](https://cms.mistral.ai/assets/67e873eb-662a-40fd-921e-ed8ea37c20b6.jpg?width=791&height=1024)

OCR result

![Image 4: 4 Ocr](https://cms.mistral.ai/assets/e594e7b2-41c2-4a7b-90ca-e1886c477eba.png?width=1894&height=1780)

Hindi

![Image 5: 5 Exemple](https://cms.mistral.ai/assets/4c0ea3e0-0128-45ab-a262-cf489b8d1b1c.png?width=1241&height=1654)

OCR result

![Image 6: Hindi Ocr](https://cms.mistral.ai/assets/2c871d1b-85e0-45a1-b9b3-053db0320ffa.png?width=1766&height=1374)

Document

![Image 7: 6 Exemple](https://cms.mistral.ai/assets/6a2e2886-1e4e-4bfe-8673-debfff5b0d2b.jpg?width=1500&height=1999)

OCR result

![Image 8: 6 Ocr](https://cms.mistral.ai/assets/82aba7f9-6a2f-495f-b4b7-d32e9ee4dd75.png?width=1900&height=1838)

Arabic

![Image 9: 7 Exemple](https://cms.mistral.ai/assets/e12333d3-1a58-4650-ae0f-d4ffe595cdfc.jpg?width=736&height=914)

OCR result

![Image 10: Arabic OCR](https://cms.mistral.ai/assets/a51226e5-fcad-4b10-8306-d89df7013a01.png?width=488&height=542)

### Top-tier benchmarks

Mistral OCR has consistently outperformed other leading OCR models in rigorous benchmark tests. Its superior accuracy across multiple aspects of document analysis is illustrated below. We extract embedded images from documents along with text. The other LLMs compared below, do not have that capability. For a fair comparison, we evaluate them on our internal “text-only” test-set containing various publication papers, and PDFs from the web; below:

     
| Model | Overall | Math | Multilingual | Scanned | Tables |
| --- | --- | --- | --- | --- | --- |
| Google Document AI | 83.42 | 80.29 | 86.42 | 92.77 | 78.16 |
| Azure OCR | 89.52 | 85.72 | 87.52 | 94.65 | 89.52 |
| Gemini-1.5-Flash-002 | 90.23 | 89.11 | 86.76 | 94.87 | 90.48 |
| Gemini-1.5-Pro-002 | 89.92 | 88.48 | 86.33 | 96.15 | 89.71 |
| Gemini-2.0-Flash-001 | 88.69 | 84.18 | 85.80 | 95.11 | 91.46 |
| GPT-4o-2024-11-20 | 89.77 | 87.55 | 86.00 | 94.58 | 91.70 |
| Mistral OCR 2503 | 94.89 | 94.29 | 89.55 | 98.96 | 96.12 |

### Natively multilingual

Since Mistral’s founding, we have aspired to serve the world with our models, and consequently strived for multilingual capabilities across our offerings. Mistral OCR takes this to a new level, being able to parse, understand, and transcribe thousands of scripts, fonts, and languages across all continents. This versatility is crucial for both global organizations that handle documents from diverse linguistic backgrounds, as well as hyperlocal businesses serving niche markets.

 
| Model | Fuzzy Match in Generation |
| --- | --- |
| Google-Document-AI | 95.88 |
| Gemini-2.0-Flash-001 | 96.53 |
| Azure OCR | 97.31 |
| Mistral OCR 2503 | 99.02 |

Benchmarks by language:

| Language | Azure OCR | Google Doc AI | Gemini-2.0-Flash-001 | Mistral OCR 2503 |
| --- | --- | --- | --- | --- |
| ru | 97.35 | 95.56 | 96.58 | 99.09 |
| fr | 97.50 | 96.36 | 97.06 | 99.20 |
| hi | 96.45 | 95.65 | 94.99 | 97.55 |
| zh | 91.40 | 90.89 | 91.85 | 97.11 |
| pt | 97.96 | 96.24 | 97.25 | 99.42 |
| de | 98.39 | 97.09 | 97.19 | 99.51 |
| es | 98.54 | 97.52 | 97.75 | 99.54 |
| tr | 95.91 | 93.85 | 94.66 | 97.00 |
| uk | 97.81 | 96.24 | 96.70 | 99.29 |
| it | 98.31 | 97.69 | 97.68 | 99.42 |
| ro | 96.45 | 95.14 | 95.88 | 98.79 |

Fastest in its category
-----------------------

Being lighter weight than most models in the category, Mistral OCR performs significantly faster than its peers, processing up to 2000 pages per minute on a single node. The ability to rapidly process documents ensures continuous learning and improvement even for high-throughput environments.

### Doc-as-prompt, structured output

Mistral OCR also introduces the use of documents as prompts, enabling more powerful and precise instructions. This capability allows users to extract specific information from documents and format it in structured outputs, such as JSON. Users can chain extracted outputs into downstream function calls and build agents. See this example [notebook](https://colab.research.google.com/github/mistralai/cookbook/blob/main/mistral/ocr/structured_ocr.ipynb).

### Available to self-host on a selective basis

For organizations with stringent data privacy requirements, Mistral OCR offers a self-hosting option. This ensures that sensitive or classified information remains secure within your own infrastructure, providing compliance with regulatory and security standards. If you would like to explore self-deployment with us, please [let us know](https://mistral.ai/contact).

Use cases
---------

We are empowering our beta customers to elevate their organizational knowledge by transforming their extensive document repositories into actions and solutions. Some of the key use cases where our technology is making a significant impact include:

**Digitizing scientific research**: Leading research institutions have been experimenting with Mistral OCR to convert scientific papers and journals into AI-ready formats, making them accessible to downstream intelligence engines. This has facilitated measurably faster collaboration and accelerated scientific workflows.

**Preserving historical and cultural heritage**: Organizations and nonprofits that are custodians of heritage have been using Mistral OCR to digitize historical documents and artifacts, ensuring their preservation and making them accessible to a broader audience.

**Streamlining customer service**: Customer service departments are exploring Mistral OCR to transform documentation and manuals into indexed knowledge, reducing response times and improving customer satisfaction.

**Making literature across design, education, legal, etc. AI ready**: Mistral OCR has also been helping companies convert technical literature, engineering drawings, lecture notes, presentations, regulatory filings and much more into indexed, answer-ready formats, unlocking intelligence and productivity across millions of documents.

Experience it today
-------------------

Mistral OCR capabilities are free to try on [le Chat](http://chat.mistral.ai/). To try the API, head over to [la Plateforme](http://console.mistral.ai/). We’d love to get your feedback; expect the model to continue to get even better in the weeks to come. As part of our strategic engagement programs, we will also offer on-premises deployment on a [selective basis](https://mistral.ai/contact).

Share

[![Image 11: linkedin](https://mistral.ai/_next/image?url=https%3A%2F%2Fcms.mistral.ai%2Fassets%2F13f44960-493e-4bbd-aa8b-0954fe88e6ad&w=32&q=75)](https://www.linkedin.com/shareArticle?mini=true&url=https://mistral.ai/en/news/mistral-ocr)[![Image 12: facebook](https://mistral.ai/_next/image?url=https%3A%2F%2Fcms.mistral.ai%2Fassets%2F1a373114-78e8-4dd2-95d9-657734768e7d&w=32&q=75)](https://www.facebook.com/sharer/sharer.php?u=https://mistral.ai/en/news/mistral-ocr)[![Image 13: twitter](https://mistral.ai/_next/image?url=https%3A%2F%2Fcms.mistral.ai%2Fassets%2F38aee0ee-5e46-4c72-8859-aa42b90a9c0b&w=32&q=75)](https://twitter.com/intent/tweet?url=https://mistral.ai/en/news/mistral-ocr)

More resources

[News](https://mistral.ai/news)[Models](https://mistral.ai/models)[AI services](https://mistral.ai/services)

The next chapter of AI is yours.


----------------------------------

[Try le Chat](https://chat.mistral.ai/)[Build on la Plateforme](https://console.mistral.ai/)[Talk to an expert](https://mistral.ai/contact)

![Image 14: LeChat - Mistral](https://cms.mistral.ai/assets/920e56ee-25c5-439d-bd31-fbdf5c92c87f)

[](https://mistral.ai/)

[![Image 15: App Stroe Mistral AI](https://mistral.ai/_next/image?url=%2Fimg%2Fappstore.svg&w=256&q=75)](https://apps.apple.com/us/app/le-chat-by-mistral-ai/id6740410176)[![Image 16: App Stroe Mistral AI](https://mistral.ai/_next/image?url=%2Fimg%2Fandroidstore.svg&w=256&q=75)](https://play.google.com/store/apps/details?id=ai.mistral.chat)

Mistral AI © 2025

[Why Mistral](https://mistral.ai/en/news/mistral-ocr#)[About us](https://mistral.ai/about)[Our customers](https://mistral.ai/customers)[Careers](https://mistral.ai/careers)[Contact us](https://mistral.ai/contact)

[Explore](https://mistral.ai/en/news/mistral-ocr#)[AI solutions](https://mistral.ai/solutions)[Partners](https://mistral.ai/partners)[Research](https://mistral.ai/news?category=research)[Documentation](https://docs.mistral.ai/)

[Build](https://mistral.ai/en/news/mistral-ocr#)[La Plateforme](https://mistral.ai/products/la-plateforme)[Le Chat](https://mistral.ai/products/le-chat)[Try the API](https://console.mistral.ai/)

[Legal](https://mistral.ai/legal)[Terms of service](https://mistral.ai/terms)[Privacy policy](https://mistral.ai/terms#privacy-policy)[Data processing agreement](https://mistral.ai/terms#data-processing-agreement)[Legal notice](https://mistral.ai/legal)

ENMistral AI © 2025

[![Image 17](https://mistral.ai/_next/image?url=https%3A%2F%2Fcms.mistral.ai%2Fassets%2F9c3aec2e-9825-4691-8458-cf4bd48ceff5&w=96&q=75)](https://x.com/mistralai)[![Image 18](https://mistral.ai/_next/image?url=https%3A%2F%2Fcms.mistral.ai%2Fassets%2Fb68af65f-220d-4116-b522-fe9ab25c7f32&w=96&q=75)](https://www.linkedin.com/company/mistralai/)[![Image 19](https://mistral.ai/_next/image?url=https%3A%2F%2Fcms.mistral.ai%2Fassets%2F0f8631ea-bfbc-4075-8f2e-c8f681076d7b&w=96&q=75)](https://discord.gg/mistralai)

![Image 20: Talk to Le Chat](https://mistral.ai/_next/image?url=%2Fimg%2FarrowUp.svg&w=32&q=75)

Links/Buttons:
- [](https://discord.gg/mistralai)
- [Try the API](https://console.mistral.ai/)
- [Talk to sales](https://mistral.ai/contact)
- [90%](https://resources.data.gov/glossary/unstructured-data/)
- [Mistral OCR](https://docs.mistral.ai/capabilities/document/)
- [la Plateforme](http://console.mistral.ai/)
- [here](https://colab.research.google.com/github/mistralai/cookbook/blob/main/mistral/ocr/structured_ocr.ipynb)
- [le Chat](http://chat.mistral.ai/)
- [News](https://mistral.ai/news)
- [Models](https://mistral.ai/models)
- [AI services](https://mistral.ai/services)
- [Try le Chat](https://chat.mistral.ai/)
- [Why Mistral](https://mistral.ai/en/news/mistral-ocr#)
- [About us](https://mistral.ai/about)
- [Our customers](https://mistral.ai/customers)
- [Careers](https://mistral.ai/careers)
- [AI solutions](https://mistral.ai/solutions)
- [Partners](https://mistral.ai/partners)
- [Research](https://mistral.ai/news?category=research)
- [Documentation](https://docs.mistral.ai/)
- [La Plateforme](https://mistral.ai/products/la-plateforme)
- [Le Chat](https://mistral.ai/products/le-chat)
- [Legal](https://mistral.ai/legal)
- [Terms of service](https://mistral.ai/terms)
- [Privacy policy](https://mistral.ai/terms#privacy-policy)
- [Data processing agreement](https://mistral.ai/terms#data-processing-agreement)
