---
aliases:
  - Web Standard
---
[[OpenSSL]]

> [!NOTE] AI Explains, ([[Poe AI]])
> ### **Primary Web Standards and Their Maintainers**
> 
> Web standards are a set of agreed-upon rules, guidelines, and technologies that ensure the compatibility, usability, and accessibility of content and applications across the internet. These standards allow web developers to create websites and applications that work consistently across different web browsers, devices, and platforms.
> 
> Here is a detailed overview of the **primary web standards** and the organizations that maintain them:
> 
> ---
> 
> ### **1. HTML (HyperText Markup Language)**
> 
> - **Purpose**:  
>     HTML is the standard markup language used to structure and display content on the web, such as text, images, and multimedia.
>     
> - **Maintainer**:
>     
>     - The **World Wide Web Consortium ([[W3C]])** is the primary maintainer of HTML standards.
>     - **WHATWG (Web Hypertext Application Technology Working Group)** also plays a significant role in shaping HTML standards, focusing on a "living standard" approach for continuous updates.
> - **Current Version**:  
>     HTML5 is the current standard, which introduced features for multimedia, APIs, and improved semantic elements.
>     
> 
> ---
> 
> ### **2. [[CSS]] (Cascading Style Sheets)**
> 
> - **Purpose**:  
>     CSS is used to define the visual presentation of web pages, including layout, colors, fonts, animations, and responsiveness.
>     
> - **Maintainer**:
>     
>     - The **[[W3C]]** maintains CSS standards through its **CSS Working Group**.
> - **Current Version**:  
>     CSS3 is the latest major version, though it is modular, with various specifications like Flexbox, Grid, and CSS Variables being continuously updated.
>     
> 
> ---
> 
> ### **3. JavaScript and ECMAScript**
> 
> - **Purpose**:  
>     JavaScript is the scripting language that enables interactive and dynamic functionality on web pages (e.g., animations, form validation). ECMAScript is the standardized specification that defines [[JavaScript]].
>     
> - **Maintainer**:
>     
>     - **[[ECMA International]]**, specifically **Technical Committee 39 (TC39)**, is responsible for maintaining and evolving ECMAScript.
> - **Current Version**:  
>     ECMAScript 2023 (ES14) is the latest version, with annual updates introducing new features.
>     
> 
> ---
> 
> ### **4. HTTP (HyperText Transfer Protocol)**
> 
> - **Purpose**:  
>     HTTP is the protocol used for transferring data between web servers and browsers. It underpins communication on the web.
>     
> - **Maintainer**:
>     
>     - The **[[Internet Engineering Task Force]] (IETF)** maintains HTTP standards through its **HTTP Working Group**.
> - **Current Version**:  
>     HTTP/3 is the latest version, which uses QUIC (a transport protocol) for faster and more secure connections.
>     
> 
> ---
> 
> ### **5. URL/URI (Uniform Resource Locator/Identifier)**
> 
> - **Purpose**:  
>     URLs and URIs are used to identify and locate resources on the web.
>     
> - **Maintainer**:
>     
>     - The **IETF** maintains URL and URI standards through its working groups.
>     - The standard for URLs is defined in **RFC 3986**.
> 
> ---
> 
> ### **6. DOM (Document Object Model)**
> 
> - **Purpose**:  
>     The DOM is a programming interface for web documents that defines the structure of HTML and XML documents and allows scripts to manipulate the document’s content and structure.
>     
> - **Maintainer**:
>     
>     - The **W3C** maintains the DOM standards.
> - **Current Version**:  
>     The DOM is a "living standard" maintained alongside HTML by the W3C and **WHATWG**.
>     
> 
> ---
> 
> ### **7. Accessibility Standards (WCAG)**
> 
> - **Purpose**:  
>     Accessibility standards ensure that web content is usable by people with disabilities (e.g., screen reader support, keyboard navigation).
>     
> - **Maintainer**:
>     
>     - The **W3C**, specifically the **Web Accessibility Initiative (WAI)**, maintains the **Web Content Accessibility Guidelines (WCAG)**.
> - **Current Version**:  
>     WCAG 2.2 (published in 2023) is the most recent version, with WCAG 3.0 under development.
>     
> 
> ---
> 
> ### **8. SVG (Scalable Vector Graphics)**
> 
> - **Purpose**:  
>     SVG is an XML-based format for describing two-dimensional vector graphics, animations, and interactivity on the web.
>     
> - **Maintainer**:
>     
>     - The **W3C** maintains SVG standards.
> - **Current Version**:  
>     SVG 1.1 is widely used, but SVG 2.0 is under development.
>     
> 
> ---
> 
> ### **9. Web APIs**
> 
> - **Purpose**:  
>     Web APIs provide interfaces for interacting with browser features, hardware, and services (e.g., Geolocation API, [[WebRTC]], [[WebGL]]).
>     
> - **Maintainer**:
>     
>     - The **W3C** and **WHATWG** collaboratively maintain many web APIs.
> - **Examples**:
>     
>     - **Fetch API**: For making HTTP requests.
>     - **WebRTC**: For real-time audio and video communication.
>     - **[[WebAssembly]] (WASM)**: A binary format for high-performance web applications.
> 
> ---
> 
> ### **10. [[Transport Layer Security]] (Transport Layer Security)**
> 
> - **Purpose**:  
>     TLS is the cryptographic protocol that ensures secure communication over the web (e.g., HTTPS).
>     
> - **Maintainer**:
>     
>     - The **IETF** maintains TLS standards through its **TLS Working Group**.
> - **Current Version**:  
>     TLS 1.3 is the latest version, offering enhanced security and performance.
>     
> 
> ---
> 
> ### **11. JSON (JavaScript Object Notation)**
> 
> - **Purpose**:  
>     JSON is a lightweight data-interchange format used for transmitting data between servers and web applications.
>     
> - **Maintainer**:
>     
>     - **[[ECMA International]]** standardized [[JSON]] in **ECMA-404**.
> 
> ---
> 
> ### **12. MIME (Multipurpose Internet Mail Extensions) Types**
> 
> - **Purpose**:  
>     MIME types are standardized identifiers for file formats (e.g., `text/html`, `application/json`) used in HTTP headers and emails.
>     
> - **Maintainer**:
>     
>     - The **[[IETF]]** maintains MIME standards.
> 
> ---
> 
> ### **13. WebRTC (Web Real-Time Communication)**
> 
> - **Purpose**:  
>     WebRTC enables peer-to-peer communication for real-time audio, video, and data sharing within browsers.
>     
> - **Maintainer**:
>     
>     - The **W3C** and **IETF** jointly maintain WebRTC standards.
> 
> ---
> 
> ### **14. XML (Extensible Markup Language)**
> 
> - **Purpose**:  
>     XML is used to structure, store, and transport data across systems and applications on the web.
>     
> - **Maintainer**:
>     
>     - The **W3C** maintains XML standards.
> 
> ---
> 
> ### **15. Unicode**
> 
> - **Purpose**:  
>     Unicode ensures consistent encoding, representation, and handling of text across all languages and platforms on the web.
>     
> - **Maintainer**:
>     
>     - The **[[Unicode Consortium]]** develops and maintains Unicode standards.
> 
> ---
> 
> ### **Key Organizations in Web Standards**
> 
> 1. **World Wide Web Consortium (W3C)**:
>     
>     - Founded by Tim Berners-Lee, the W3C develops and maintains many core web standards, including HTML, CSS, SVG, and accessibility guidelines.
>     - Website: [w3.org](https://www.w3.org)
> 2. **Internet Engineering Task Force (IETF)**:
>     
>     - Focuses on core internet protocols like HTTP, URI, TLS, and MIME.
>     - Website: [ietf.org](https://www.ietf.org)
> 3. **Web Hypertext Application Technology Working Group (WHATWG)**:
>     
>     - Maintains "living standards" for HTML, DOM, and other web technologies, often in collaboration with the W3C.
>     - Website: [whatwg.org](https://www.whatwg.org)
> 4. **ECMA International**:
>     
>     - Responsible for ECMAScript (JavaScript) and JSON standards.
>     - Website: [ecma-international.org](https://www.ecma-international.org)
> 5. **[[Unicode Consortium]]**:
>     
>     - Maintains the Unicode standard for text encoding across languages.
>     - Website: [unicode.org](https://www.unicode.org)
> 6. **[[Internet Corporation for Assigned Names and Numbers]] (ICANN)**:
>     
>     - Manages domain names, IP addresses, and DNS standards.
>     - Website: [icann.org](https://www.icann.org)
> 7. **[[Khronos Group]]**:
>     
>     - Develops open standards for graphics, compute, and media, such as WebGL and WebGPU.
>     - Website: [khronos.org](https://www.khronos.org)
> 
> ---
> 
> ### **Conclusion**
> 
> Web standards are essential for maintaining a consistent, interoperable, and user-friendly internet experience. They are developed and maintained by global organizations like the **W3C**, **IETF**, and **ECMA International**, often in collaboration with major technology companies. These standards ensure that the web remains a universal platform for innovation, creativity, and communication.

