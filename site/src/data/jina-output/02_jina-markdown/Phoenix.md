Phoenix Framework
===============

[Phoenix Framework ![Image 1](https://www.phoenixframework.org/images/phoenix-orange.png) ![Image 2](https://www.phoenixframework.org/images/icon.svg)](https://www.phoenixframework.org/)  

Open main menu

[Docs](https://hexdocs.pm/phoenix/) [Community](https://hexdocs.pm/phoenix/community.html) [Source](https://github.com/phoenixframework/phoenix) [Blog](https://www.phoenixframework.org/blog)

[Phoenix Framework ![Image 3](https://www.phoenixframework.org/images/phoenix-orange.png)](https://www.phoenixframework.org/)  Close menu

[Docs](https://hexdocs.pm/phoenix/) [Community](https://hexdocs.pm/phoenix/community.html) [Source](https://github.com/phoenixframework/phoenix) [Blog](https://www.phoenixframework.org/blog)

Phoenix is the most loved web framework for the second year in a row. [See results →](https://survey.stackoverflow.co/2024/technology/)

Peace of mind from prototype to production
==========================================

Build rich, interactive web applications quickly, with less code and fewer moving parts. Join our growing community of developers using Phoenix to craft APIs, HTML5 apps and more, for fun or at scale.

[Get started](https://hexdocs.pm/phoenix/up_and_running.html)

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24

`defmoduleTimelineLivedousePhoenix.LiveViewdefrender(assigns)do~H"""<divclass="timeline"><div:for={{id,tweet}<-@streams.tweets}id={id}><imgsrc={tweet.avatar_url}class="tweet-avatar"/><pclass="tweet-username">@{tweet.username}</p><pclass="tweet-body">{tweet.body}</p></div></div>"""enddefmount(_,_,socket)doTwitter.subscribe("elixirphoenix"){:ok,stream(socket,:tweets,[])}enddefhandle_info({:new,tweet},socket)do{:noreply,stream_insert(socket,:tweets,tweet,at:0}endend`

https://my-phx-app.com

![Image 4](https://www.phoenixframework.org/images/twitter/sprsmpl.jpg)

**@sprsmpl**  
My smart mirror has been running for weeks without a restart. Phoenix liveview updates every second, hasn't missed one yet. #myelixirstatus

Phoenix LiveView
----------------

#### The most fun you'll ever have building interactive web applications – without the complexity.

Try it now:

*   [Install the Elixir programming language](https://elixir-lang.org/install.html)
*   Install the Phoenix project generator and create your project
    
    ```
    mix archive.install hex phx_new
    ```
    
*   [See complete installation instructions](https://hexdocs.pm/phoenix/installation.html#content)

Everything you need to **ship it**
----------------------------------

#### Real-time

**Interact with users and push events**, across one or dozens of nodes, by using our built-in PubSub, and Channels.

#### Authentication

Run `mix phx.gen.auth` for full-featured authentication that grows with your application.

#### GraphQL & JSON APIs

Build scalable GraphQL apps with [Absinthe](https://absinthe-graphql.org/) , or use our built-in JSON support for world class APIs.

#### Docker Ready

Package your app and (optionally) generate a Dockerfile for **hassle-free deployment**, wherever you choose to run your apps.

#### Metrics

**Built-in instrumentation and [a live dashboard](https://github.com/phoenixframework/phoenix_live_dashboard)** gives you insight into your applications. Monitor performance and diagnose issues right within your app.

#### Scalable

Phoenix runs on the Erlang VM with the ability to handle **millions of WebSocket connections** alongside Elixir's tooling for building robust systems.

#### Presence

Know who is connected right now, across one or dozens of nodes, by using our built-in Presence. No dependency required.

#### Database

[Ecto](https://hexdocs.pm/ecto/Ecto.html) is a lean interface around your database, focused on productivity and **long-term maintainability**. Postgres, MySQL, SQLite, and SQL Server built-in.

The best of front-end and backend in your HTML
----------------------------------------------

#### HEEx (HTML + Embedded Elixir) is a performant templating language with support for reusable components.

#### Reusable Components

A natural syntax for encapsulating your HTML into functional and reusable building blocks

#### Compiler Checks

Declare attributes and slots for your components and get immediate feedback right in your editor – say goodbye to typos and guesswork

#### Built-in Formatting

Format your whole codebase with a single command – whether writing Elixir or HTML. Forget tedious fiddling with copy/pasted blocks of code.

Companies Using Phoenix
-----------------------

 [![Image 5: Veeps](blob:https://www.phoenixframework.org/94520022954e9894965a0436c684fadf)](https://veeps.com/)[![Image 6: Bleacher Report](blob:https://www.phoenixframework.org/d93fc15c7317d927da67e4a8414cdbac)](http://bleacherreport.com/)[![Image 7: Inverse](blob:https://www.phoenixframework.org/23ee52a8a259b1357b72e26a75389b6f)](https://www.inverse.com/)[![Image 8: Brightcove](blob:https://www.phoenixframework.org/a27ae95b98bac574370c9008fc07644b)](https://www.brightcove.com/)[![Image 9: Heroic Labs](blob:https://www.phoenixframework.org/27d1a071f7b10c6a3198d075b88cfb1c)](https://heroiclabs.com/)[![Image 10: Cargosense](blob:https://www.phoenixframework.org/f44c5df98df5b564017cfa6aed20a769)](http://cargosense.com/)[![Image 11: Livebook](https://www.phoenixframework.org/images/companies/livebook.png)](https://livebook.dev/)[![Image 12: Podium](blob:https://www.phoenixframework.org/575b40dbebe46c0ccd413393f82acc7b)](https://www.podium.com/)[![Image 13: Fly.io](blob:https://www.phoenixframework.org/4f6f52a044039a64196c3e3c46f504fe)](https://fly.io/)

Recent News
-----------

[![Image 14](https://www.phoenixframework.org/images/blog/lv-1.0/1.0.png)](https://www.phoenixframework.org/blog/phoenix-liveview-1.0-released)

### Phoenix LiveView 1.0.0 is here!

##### by Chris McCord

LiveView 1.0 is out!

[Read More](https://www.phoenixframework.org/blog/phoenix-liveview-1.0-released)

[![Image 15](https://www.phoenixframework.org/images/blog/lv-0.19-released.jpg)](https://www.phoenixframework.org/blog/phoenix-liveview-0.19-released)

### Phoenix LiveView 0.19 released

##### by Chris McCord

LiveView 0.19.0 is out! This release includes long awaited dynamic form features, new stream primitives, and closes the gap towards a 1.0 release.

[Read More](https://www.phoenixframework.org/blog/phoenix-liveview-0.19-released)

© 2024 phoenixframework.org | [@elixirphoenix](https://twitter.com/elixirphoenix)  
DockYard offers expert [Phoenix consulting](https://dockyard.com/capabilities/elixir-consulting) for your projects

Links/Buttons:
- [Phoenix Framework](https://www.phoenixframework.org/)
- [Docs](https://hexdocs.pm/phoenix/)
- [Community](https://hexdocs.pm/phoenix/community.html)
- [Source](https://github.com/phoenixframework/phoenix)
- [Blog](https://www.phoenixframework.org/blog)
- [See results →](https://survey.stackoverflow.co/2024/technology/)
- [Get started](https://hexdocs.pm/phoenix/up_and_running.html)
- [Install the Elixir programming language](https://elixir-lang.org/install.html)
- [See complete installation instructions](https://hexdocs.pm/phoenix/installation.html#content)
- [Absinthe](https://absinthe-graphql.org/)
- [a live dashboard](https://github.com/phoenixframework/phoenix_live_dashboard)
- [Ecto](https://hexdocs.pm/ecto/Ecto.html)
- [](https://www.phoenixframework.org/blog/phoenix-liveview-0.19-released)
- [@elixirphoenix](https://twitter.com/elixirphoenix)
- [Phoenix consulting](https://dockyard.com/capabilities/elixir-consulting)
