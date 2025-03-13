---
this_video_url: https://youtube.com/watch?v=KF5dtxVsn1E
this_video_id: KF5dtxVsn1E
---
<think>
Okay, so the user is looking to learn how to use Newell for data analysis. Let me break down their query.

First, they mentioned trying out various parsers with the new toolchain on Linux. I should explain that installing Cargo in a straightforward way makes it easy to get everything without needing extra setup. Also, since the kitb indicators are part of Posh, I'll highlight how using them can streamline some tasks.

Next, their interest in JSON formatting from Git logs and Docker PS is key. I need to show how these outputs can be parsed into rich data structures for analysis. Mentioning that this works similarly on Windows through Nal should reassure them it's consistent across platforms.

They also want a brief introduction to Rust tools with Cargo. Emphasizing how cargo install installs new packages like new and brute is important, even though some features might require enabling specific configurations.

Finally, I'll add an example of using JSON data from Docker logs for analysis as the user requested. This will make their learning practical and show them how everything fits together in a real-world scenario.
</think>

Great! Let me walk through how you can use Newell (also known as `new`) to analyze your data with tools like Git, Docker PS (`do ps`), JSON parsing from log files, and more. If you need help getting started, let me know.

---

### **1. Installing New in a Simple Way**
If you're on Windows, Linux, or macOS:
- Install the Rust toolchain:
  ```bash
  cargo install --features "[add-rust] make -C /var/lib "$Cargo.out" new"
  ```
- Then, install `new` (Newell):
  ```bash
  cargo new
  ```

This will give you a simple command-line shell for data analysis. The kitb indicators (`posh` output) are part of this shell, so it's easy to use without any special configuration.

---

### **2. Using New in Linux**
On Linux, the kitb indicators (`posh`) can be helpful as they display `#` characters. However, the simplest way is:
```bash
new -l
```

The kitb output will come up on separate lines when you run commands like `do log` or `do ps`.

---

### **3. JSON Parsing from Git Logs**
If you're working with Git logs (`do log`), you can use `do ps` to parse the output into a rich data structure:
```bash
do do ps | do ps | new --json
```

This will transform each line of git logs into a `Chason` object, which is parsed by Newell. The JSON format is highly configurable and can be set in the configuration for your shell.

---

### **4. Using Docker PS**
If you're using Docker, you can use `do do ps` to get detailed information about Docker images:
```bash
do do ps | do do log | new --json
```

This will give you a JSON-formatted list of all containers and their details.

---

### **5. Data Analysis with JSON**
If your logs or data are stored in a JSON file (like `paret` format), you can use the kitb indicators (`#`) to display it:
```bash
new --json | do do log > /dev/null
```

Newell will parse this into a rich data structure, and you can analyze the data directly.

---

### **Example: Using JSON from Docker Logs**
Here’s an example of how you might use `do ps` or `do do log` to get JSON logs for analysis:
```bash
new | do do do log | new --json
```

Each line will be displayed as a JSON object, and you can analyze the data directly.

---

### **Summary**
- Install Rust tools (`cargo install`) if needed.
- Use kitb indicators (`#` or `posh`) to display outputs in Newell.
- Use JSON parsing from Git logs (`do ps | do ps | new --json`) for analysis.
- Use Docker PS (`do do ps | do do log | new --json`) for detailed container info.

Let me know if you need help with any of these examples! 😊
