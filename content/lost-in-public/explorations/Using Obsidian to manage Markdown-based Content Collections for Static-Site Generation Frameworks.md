---
date_created: 2024-11-01
date_modified: 2025-03-21
---

|>update_start::2025-03-19T19:25:22.108Z
#### Backlinks should be set to Absolute Path 

[[Backlinks]] default to only including the file name.  Obsidian's app has a really smooth, fast way of keeping an index of the location of files, so Obsidian is self-aware, clearly has some kind of observer.
![](https://i.imgur.com/7rHeIga.png)

This poses a problem for using [[Backlinks]] as tool to create a kind of [[Wiki]] feature of your own website and its content.  When rendering a Markdown file as web content, any link to internal content will need to have the relative path from the root of the site directory (or some alias that can be set up).

Unfortunately, I've been using Obsidian for about five months and I only figured out that [[Tooling/Productivity/Obsidian|Obsidian]] has an option in their Core Plugins/Backlinks that allows you to default to writing the  the absolute path from the vault route in the backlink.

However, apparently there is not a built in way to then automatically convert pre-created backlinks into 

|>update_end::2025-03-19T19:25:22.108Z

# Stealing Flavoured Syntax from anywhere

#### Embeds with Emoji class selectors
Callouts are very nearly equivalent to standard Markdown block quotes in their syntax, other than some specific requirements on their content: To be considered a “callout”, a block quote must start with an initial emoji. This is used to determine the callout's theme. Here's an example of how you might write a success callout.

```markdown
> 🎅 Success 
>  
> Vitae reprehenderit at aliquid error voluptates eum dignissimos.
```

```css
.markdown-body .callout[theme='🎅'] {
	--background: #c54245; 
	--border: #ffffff6b; 
	--text: #f5fffa; }
```
#### Embeds
[Embeds from Readme](https://docs.readme.com/rdmd/docs/embeds#syntax)

Simple embedded content is written as a Markdown link, with a title of "@embed", like so:

```
[Embed Title](https://youtu.be/8bh238ekw3 "@embed")
```

More robust embedded content is written as a JSX component:

```
<Embed
  html={false}
  url="https://github.com/readmeio/api-explorer/pull/671"
  title="RDMD CSS theming and style adjustments. by rafegoldberg · Pull Request #671 · readmeio/api-explorer"
  favicon="https://github.com/favicon.ico"
  image="https://avatars2.githubusercontent.com/u/6878153?s=400&v=4"
/>
```

#### Tabbed Code Blocks

[[Readme]]'s [Tabbed Code Blocks](https://docs.readme.com/rdmd/docs/code-blocks#tabbed-code-blocks)

````markdown
```javascript I'm A tab
console.log('Code Tab A');
```
```javascript I'm tab B
console.log('Code Tab B');
```
````

[CSS Colors for Code Blocks](https://docs.readme.com/rdmd/docs/code-blocks#custom-css)

```
.markdown-body {
  --md-code-background: #e3dcef;
  --md-code-text: #4a2b7b;
  --md-code-tabs: #c6b8dd;
  --md-code-radius: 4px;
}
```




# Creating a Site Flavoured Syntax of my own.
### Inventing custom Dynamic Variables

I've always wanted to keep an "evolving" textbook of everything I'm learning. I build it as I go. But, other than co-opting [[Tooling/Products/Git|Git]], I never imagined being able to do it. So:

#### An update timestamp Markdown
`|>>update_start::2025-03-19T19:25:22.108Z`
`|>>update_end::2025-03-19T19:25:22.108Z` 


#### Standardizing strings inside Callouts

TIPS, 
```
[!@Q&A] [--Q|'Michael', --A|'George']--[--Source|'[[Stack Overflow]]]
[!--Q%01] How would you refactor this?
[!--A%01] I recommend setting user options up top
```

@SPEAKS::

# Using YAML Frontmatter
Mapped to [[YAML]], [[Emergent-Innovation/Standards/Markdown|Markdown]]








