
```javascript
import OpenAI from "openai";
const client = new OpenAI();

const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{
        role: "user",
        content: "Write a one-sentence bedtime story about a unicorn.",
    }],
});

console.log(completion.choices[0].message.content);
```

```bash
curl https://api.openai.com/v1/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-4o",
        "messages": [{
            "role": "user",
            "content": "Write a one-sentence bedtime story about a unicorn."
        }]
    }'

```

```python
from openai import OpenAI
client = OpenAI()

completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "user",
        "content": "Write a one-sentence bedtime story about a unicorn."
    }]
)

print(completion.choices[0].message.content)

```

## Text generation and prompting

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {
            role: "user",
            content: "Write a one-sentence bedtime story about a unicorn.",
        },
    ],
});

console.log(completion.choices[0].message.content);
```

```json
[
    {
        "index": 0,
        "message": {
            "role": "assistant",
            "content": "Under the soft glow of the moon, Luna the unicorn danced through fields of twinkling stardust, leaving trails of dreams for every child asleep.",
            "refusal": null
        },
        "logprobs": null,
        "finish_reason": "stop"
    }
]
```

## Message roles and instruction following

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {
            role: "developer",
            content: "Talk like a pirate."
        },
        {
            role: "user",
            content: "Are semicolons optional in JavaScript?",
        },
    ],
});

console.log(completion.choices[0].message);
```

## Uploading Files
```javascript
import fs from "fs";
import OpenAI from "openai";
const client = new OpenAI();

const file = await client.files.create({
    file: fs.createReadStream("draconomicon.pdf"),
    purpose: "user_data",
});

const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {
            role: "user",
            content: [
                {
                    type: "file",
                    file: {
                        file_id: file.id,
                    }
                },
                {
                    type: "text",
                    text: "What is the first dragon in the book?",
                },
            ],
        },
    ],
});

console.log(completion.choices[0].message.content);

import fs from "fs";
import OpenAI from "openai";
const client = new OpenAI();

const data = fs.readFileSync("draconomicon.pdf");
const base64String = data.toString("base64");

const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {
            role: "user",
            content: [
                {
                    type: "file",
                    file: {
                        filename: "draconomicon.pdf",
                        file_data: `data:application/pdf;base64,${base64String}`
                    }
                },
                {
                    type: "text",
                    text: "What is the first dragon in the book?",
                },
            ],
        },
    ],
});

console.log(completion.choices[0].message.content);
```

## Manually managing conversation state

```javascript

import OpenAI from "openai";

const openai = new OpenAI();

const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        {
            role: "user",
            content: "knock knock.",
        },
        {
            role: "assistant",
            content: "Who's there?",
        },
        {
            role: "user",
            content: "Orange.",
        },
    ],
});

console.log(response.choices[0].message.content);
```

## Structured Output

```javascript

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

const CalendarEvent = z.object({
  name: z.string(),
  date: z.string(),
  participants: z.array(z.string()),
});

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "Extract the event information." },
    { role: "user", content: "Alice and Bob are going to a science fair on Friday." },
  ],
  response_format: zodResponseFormat(CalendarEvent, "event"),
});

const event = completion.choices[0].message.parsed;
```

## [Chain of thought](https://platform.openai.com/docs/guides/structured-outputs#chain-of-thought)

```javascript
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const Step = z.object({
  explanation: z.string(),
  output: z.string(),
});

const MathReasoning = z.object({
  steps: z.array(Step),
  final_answer: z.string(),
});

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "You are a helpful math tutor. Guide the user through the solution step by step." },
    { role: "user", content: "how can I solve 8x + 7 = -23" },
  ],
  response_format: zodResponseFormat(MathReasoning, "math_reasoning"),
});

const math_reasoning = completion.choices[0].message.parsed;
```

## [Structured data extraction](https://platform.openai.com/docs/guides/structured-outputs#structured-data-extraction)

```javascript
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const ResearchPaperExtraction = z.object({
  title: z.string(),
  authors: z.array(z.string()),
  abstract: z.string(),
  keywords: z.array(z.string()),
});

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "You are an expert at structured data extraction. You will be given unstructured text from a research paper and should convert it into the given structure." },
    { role: "user", content: "..." },
  ],
  response_format: zodResponseFormat(ResearchPaperExtraction, "research_paper_extraction"),
});

const research_paper = completion.choices[0].message.parsed;
```

## Example Response
```json
{
  "title": "Application of Quantum Algorithms in Interstellar Navigation: A New Frontier",
  "authors": [
    "Dr. Stella Voyager",
    "Dr. Nova Star",
    "Dr. Lyra Hunter"
  ],
  "abstract": "This paper investigates the utilization of quantum algorithms to improve interstellar navigation systems. By leveraging quantum superposition and entanglement, our proposed navigation system can calculate optimal travel paths through space-time anomalies more efficiently than classical methods. Experimental simulations suggest a significant reduction in travel time and fuel consumption for interstellar missions.",
  "keywords": [
    "Quantum algorithms",
    "interstellar navigation",
    "space-time anomalies",   
    "quantum superposition",
    "quantum entanglement",
    "space travel"
  ]
}
```
## [UI Generation](https://platform.openai.com/docs/guides/structured-outputs#ui-generation)

```javascript
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const UI = z.lazy(() =>
  z.object({
    type: z.enum(["div", "button", "header", "section", "field", "form"]),
    label: z.string(),
    children: z.array(UI),
    attributes: z.array(
      z.object({
        name: z.string(),
        value: z.string(),
      })
    ),
  })
);

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    {
      role: "system",
      content: "You are a UI generator AI. Convert the user input into a UI.",
    },
    { role: "user", content: "Make a User Profile Form" },
  ],
  response_format: zodResponseFormat(UI, "ui"),
});

const ui = completion.choices[0].message.parsed;
```

# [Reasoning](https://platform.openai.com/docs/guides/reasoning#get-started-with-reasoning)

![](https://i.imgur.com/ueZ058L.png)

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const prompt = `
Write a bash script that takes a matrix represented as a string with 
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
`;
 
const completion = await openai.chat.completions.create({
  model: "o3-mini",
  reasoning_effort: "medium",
  messages: [
    {
      role: "user", 
      content: prompt
    }
  ],
  store: true,
});

console.log(completion.choices[0].message.content);
```