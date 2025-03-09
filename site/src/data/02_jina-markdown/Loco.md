Loco.rs - Productivity-first Rust Fullstack Web Framework
===============               

[![Image 1](https://loco.rs/icon.svg)](https://loco.rs/)

[Docs](https://loco.rs/docs/getting-started/tour/) [Blog](https://loco.rs/blog/) [Casts](https://loco.rs/casts/)

Toggle Menu

 [![Image 2](https://loco.rs/icon.svg)](https://loco.rs/)[Docs](https://loco.rs/docs/getting-started/tour/) [Blog](https://loco.rs/blog/) [Casts](https://loco.rs/casts/)

[Twitter](https://twitter.com/jondot)

[GitHub](https://github.com/loco-rs/loco)

![Image 3](https://loco.rs/header.svg)

It’s Like Ruby on Rails, but for Rust.
======================================

Get the same great building experience of Rails, with the incredible  
performance and safety of Rust.
------------------------------------------------------------------------------------------------------

[Get started →](https://loco.rs/docs/getting-started/tour/)

It’s time to make Rust your super-power.
========================================

Using Rust with Loco is super easy. With a simple request lifecycle,  
code generators, productivity toolkits and more.
-----------------------------------------------------------------------------------------------------------------------

$ cargo loco generate scaffold post title:string content:text

added: "src/controllers/post.rs"
injected: "src/controllers/mod.rs"
injected: "src/app.rs"
...

$ cargo loco start

                      ▄     ▀
                                 ▀  ▄
                  ▄       ▀     ▄  ▄ ▄▀
                                    ▄ ▀▄▄
                        ▄     ▀    ▀  ▀▄▀█▄
                                          ▀█▄
▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄▄▄ ▀▀█
 ██████  █████   ███ █████   ███ █████   ███ ▀█
 ██████  █████   ███ █████   ▀▀▀ █████   ███ ▄█▄
 ██████  █████   ███ █████       █████   ███ ████▄
 ██████  █████   ███ █████   ▄▄▄ █████   ███ █████
 ██████  █████   ███  ████   ███ █████   ███ ████▀
   ▀▀▀██▄ ▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀ ██▀
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
                https://loco.rs

environment: development
   database: automigrate
     logger: disabled
compilation: debug
      modes: server

listening on localhost:5150

![Image 4](https://loco.rs/cloud.svg)

Enjoy that sweet & effortless Rust performance
==============================================

Loco packs a lot of features and still gives you 10x more  
performance compared to Node.js
-------------------------------------------------------------------------------------------

![Image 5](https://loco.rs/bench-db-q.svg) ![Image 6](https://loco.rs/bench-no-db.svg)

[Get started →](https://loco.rs/docs/getting-started/tour/)

![Image 7](https://loco.rs/mountain-bg.svg)

Build apps locally and save lots of time.
=========================================

No need for SaaS or cloud services. Save time, money, and effort with  
auth, workers, emails & more out of the box.
--------------------------------------------------------------------------------------------------------------------

```rust
impl Model {
  pub async fn find_by_email(db: &DatabaseConnection, email: &str)
  -> ModelResult<Self> {

      Users::find()
        .filter(eq(Column::Email, email))
        .one(db).await?
        .ok_or_else(|| ModelError::EntityNotFound)
  }
  
  pub async fn create_report(&self, ctx: &AppContext) -> Result<()> {
      ReportWorker::perform_later(
        &ctx, 
        ReportArgs{ user_id: self.id }
      ).await?;
  }
}
```

### Models

Model your business with rich entities and avoid writing SQL, backed by SeaORM. Build relations, validation and custom logic on your entities for the best maintainability.

```rust
pub async fn get_one(
    respond_to: RespondTo,
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let item = Notes::find_by_id(id).one(&ctx.db).await?;
    match respond_to {
      RespondTo::Html => html_view(&item),
      _ => format::json(item),
    }
}

pub fn routes() -> Routes {
    Routes::new()
      .prefix("notes")
      .add("/{id}", get(get_one))
}
```

### Controllers

Handle Web requests parameters, body, validation, and render a response that is content-aware. We use Axum for the best performance, simplicity and extensibility.

```rust

// Literals
format::text("Loco")

// Tera view engine
format::render().view(v, "home/hello.html", json!({}))

// strongly typed JSON responsed, backed by `serde`
format::json(Health { ok: true })

// Etags, cookies, and more
format::render().etag("loco-etag")?.empty()

```

### Views

Use server-rendered templates with Tera or JSON. Loco can render views on the server or work with a frontend app seamlessly. Configure your fullstack set up any way you like.

```rust
impl worker::Worker<DownloadArgs> for UsersReportWorker {
    async fn perform(&self, args: DownloadArgs) -> worker::Result<()> {
        let all = Users::find()
          .all(&self.ctx.db)
          .await
          .map_err(Box::from)?;
        for user in &all {
          println!("user: {}", user.id);
        }
        Ok(())
    }
}

```

### Background Jobs

Perform compute or I/O intensive jobs in the background with a Redis backed queue, or with threads. Implementing a worker is as simple as implementing a `perform` function for the `Worker` trait.

```sh

$ cargo loco generate deployment
? ❯ Choose your deployment ›
❯ Docker
❯ Shuttle
❯ Nginx

..
✔ ❯ Choose your deployment · Docker
skipped (exists): "dockerfile"
added: ".dockerignore"

```

### Deployment

Easily generate deployment configurations with a guided CLI interface. Select from deployment options for tailored deployment setups.

```yaml
jobs:
  db_vaccum:
    run: "db_vaccum.sh"
    shell: true
    schedule: "0 0 * * *"
    tags: ["maintenance"]

  send_birthday:
    run: "user_birthday_task"
    schedule: "Run every 2 hours"
    tags: ["marketing"]
       
```

### Scheduler

Simplifies the traditional, often cumbersome crontab system, making it easier and more elegant to schedule tasks or shell scripts.

[Read the Guide →](https://loco.rs/docs/getting-started/guide/)

![Image 8](https://loco.rs/icon.svg)

[Github](https://github.com/loco-rs/loco) [Code of Conduct](https://github.com/loco-rs/loco/blob/master/CODE_OF_CONDUCT.md) [License](https://github.com/loco-rs/loco/blob/master/LICENSE) [Security](https://github.com/loco-rs/loco/blob/master/SECURITY.md)

Links/Buttons:
- [](https://loco.rs/)
- [Docs](https://loco.rs/docs/getting-started/tour/)
- [Blog](https://loco.rs/blog/)
- [Casts](https://loco.rs/casts/)
- [Twitter](https://twitter.com/jondot)
- [GitHub](https://github.com/loco-rs/loco)
- [Read the Guide →](https://loco.rs/docs/getting-started/guide/)
- [Code of Conduct](https://github.com/loco-rs/loco/blob/master/CODE_OF_CONDUCT.md)
- [License](https://github.com/loco-rs/loco/blob/master/LICENSE)
- [Security](https://github.com/loco-rs/loco/blob/master/SECURITY.md)
