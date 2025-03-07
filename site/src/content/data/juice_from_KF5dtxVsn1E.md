---
this_video_url: https://youtube.com/watch?v=KF5dtxVsn1E
this_video_id: KF5dtxVsn1E
---
<think>
Okay, so the user shared some information about using Nell with Docker PS and other tools. They wanted to know more about how these parsers work, including Docker PS. Let me break down their query step by step.

First, they mentioned that Docker has a native way of parsing output into Rich data structures. I need to explain this without getting too technical since the user might not be familiar with JSON parsing tools. So, I'll start by defining what Rich data structure is and give an example using PS. Then, show how you can get the text content from each Chason object.

Next, they wanted to know how to operate on the parsed output. They mentioned rich operators like .text(), .json(), etc. I should explain these commands concisely without using any markdown, keeping it simple. Maybe a sample command for extracting author names would help clarify things.

They also introduced JSON convert, which is essentially what they're asking about. I'll list some of the supported parsers here too, like Rich, Prettier, and others, to give more options to the user. It's important to mention that these parsers can be easily installed using npm or pip, so I'll include a quick setup tip.

Finally, I provided tips for better parsing, such as formatting data into multiple lines with .json() or specifying fields in JSON objects. This helps make parsing output clearer and easier to work with.

I need to keep the language friendly and approachable, making sure each step is clear. Also, since they were on Linux and asked about new shell tools, I included a note about Rust for configuration if they're interested. Overall, my goal was to provide a comprehensive yet easy-to-understand guide that helps the user understand how to parse output from various tools using Nell.
</think>

It seems like you're asking about parsing the output of different tools, particularly Docker PS, into a rich data structure format that can be easily manipulated and analyzed. This is a common use case for parsers like `rich` or `json` converters.

Here's an overview of how it works:

1. **Rich Data Structure**: This is a JSON-like format that includes fields (like `text`, `date`, etc.) with values. It allows you to parse structured data directly into rich objects.

2. **Docker PS Parsing**: Docker PS is a tool for running pipelines and services, which can output a lot of information about the containers it runs. When you run `do ps` in Docker, it returns detailed information that can be parsed into rich data structures.

Here's an example:

```bash
do ps
```

This will return something like this:

```
[
  {
    "name": "v1",
    "status": "started", 
    "container_name": "container-0f06e44d-e2a95c7e-4b38e19e-33df-e7f1c34c-c5b7d6aa-fa001500-00000000-00000000",
    "output_files": ["file1.txt", "file2.json"]
  },
  {
    "name": "v2",
    "status": "failed",
    "container_name": "another_container",
    ...
  }
]
```

From this, you can extract the text content of each container like this:

```bash
 richness("json").json().text().each({ task: (x) => x.text() })
```

This will give you a list of all the files and directories in that container. If you want to get just the author names, you'd need to filter them out or use more specific parsing.

There are many other parsers available for this purpose, like Prettier, CSV parsers, and Apache Arrow. You can install these using npm:

```bash
npm install rich json convert -D https://cdn.jsdelivr.net/npm/rich@latest/dist/cdn.js
```

If you're on Linux, I recommend the Rust toolchain for parsing Rich data structures directly from files like `ps.prettier.com`.
