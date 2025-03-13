Ruby on Rails — A web-app framework that includes everything needed to create database-backed web applications according to the Model-View-Controller (MVC) pattern.
===============   

[\[Rails World 2025\] CFP is now open - submit by April 10](https://rubyonrails.org/2025/3/7/apply-to-speak-at-rails-world-2025)

[](https://rubyonrails.org/)

*   [Source](https://github.com/rails/rails)
*   [Docs](https://rubyonrails.org/docs)
*   [Community](https://rubyonrails.org/community)
*   [News](https://rubyonrails.org/blog)

*   [Events](https://rubyonrails.org/world)
*   [Jobs](https://jobs.rubyonrails.org/)
*   [Merch](https://merch.rubyonrails.org/)
*   [Foundation](https://rubyonrails.org/foundation)

Compress the complexity of modern web apps.
===========================================

#### Learn just what you need to get started, then keep leveling up as you go. **Ruby on Rails scales from HELLO WORLD to IPO.**

[Rails 8.0.1 — released December 13, 2024](https://rubyonrails.org/2024/12/13/Rails-Version-8-0-1-has-been-released)

You’re in good company.
=======================

#### Over the past two decades, Rails has taken countless companies to millions of users and billions in market valuations.

[![Image 1: Basecamp](https://rubyonrails.org/assets/images/logo-basecamp.svg)](https://basecamp.com/)

[![Image 2: HEY](https://rubyonrails.org/assets/images/logo-hey.svg)](https://hey.com/)

[![Image 3: GitHub](https://rubyonrails.org/assets/images/logo-github.svg)](https://github.com/)

[![Image 4: Shopify](https://rubyonrails.org/assets/images/logo-shopify.svg)](https://shopify.com/)

[![Image 5: Instacart](https://rubyonrails.org/assets/images/logo-instacart.svg)](https://instacart.com/)

[![Image 6: Dribbble](https://rubyonrails.org/assets/images/logo-dribbble.svg)](https://dribbble.com/)

[![Image 7: Gusto](https://rubyonrails.org/assets/images/logo-gusto.svg)](https://gusto.com/)

[![Image 8: Zendesk](https://rubyonrails.org/assets/images/logo-zendesk.svg)](https://zendesk.com/)

[![Image 9: Airbnb](https://rubyonrails.org/assets/images/logo-airbnb.svg)](https://airbnb.com/)

[![Image 10: Square](https://rubyonrails.org/assets/images/logo-square.svg)](https://squareup.com/)

[![Image 11: Kickstarter](https://rubyonrails.org/assets/images/logo-kickstarter.svg)](https://kickstarter.com/)

[![Image 12: Heroku](https://rubyonrails.org/assets/images/logo-heroku.svg)](https://heroku.com/)

[![Image 13: Coinbase](https://rubyonrails.org/assets/images/logo-coinbase.svg)](https://coinbase.com/)

[![Image 14: Soundcloud](https://rubyonrails.org/assets/images/logo-soundcloud.svg)](https://soundcloud.com/)

[![Image 15: Cookpad](https://rubyonrails.org/assets/images/logo-cookpad.svg)](https://cookpad.com/)

[![Image 16: Doximity](https://rubyonrails.org/assets/images/logo-doximity.svg)](https://www.doximity.com/)

[![Image 17: Intercom](https://rubyonrails.org/assets/images/logo-intercom.svg)](https://www.intercom.com/)

[![Image 18: Fleetio](https://rubyonrails.org/assets/images/logo-fleetio.svg)](https://www.fleetio.com/)

[![Image 19: Lime](https://rubyonrails.org/assets/images/logo-lime.svg)](https://li.me/)

[![Image 20: FreeAgent](https://rubyonrails.org/assets/images/logo-freeagent.svg)](https://www.freeagent.com/)

**These are just a few of the big names.** There have been many hundreds of thousands of apps created with Rails since its inception.

Building it together.
=====================

#### Over six thousand people have [contributed code to Rails](https://contributors.rubyonrails.org/), and many more have served the community through evangelism, documentation, and bug reports. Join us!

[Meet the Rails team](https://rubyonrails.org/community)

Everything you need.
====================

#### **Rails is a full-stack framework.** It ships with all the tools needed to build amazing web apps on both the front and back end.

Rendering HTML templates, updating databases, sending and receiving emails, maintaining live pages via WebSockets, enqueuing jobs for asynchronous work, storing uploads in the cloud, providing solid security protections for common attacks. Rails does it all and so much more.

###### app/models/article.rb

```ruby
class Article < ApplicationRecord
  belongs_to :author, default: -> { Current.user }
  has_many   :comments

  has_one_attached :cover_image
  has_rich_text :content, encrypted: true
  enum status: %i[ drafted published ]

  scope :recent, -> { order(created_at: :desc).limit(25) }

  after_save_commit :deliver_later, if: :published?

  def byline
    "Written by #{author.name} on #{created_at.to_s(:short)}"
  end

  def deliver_later
    Article::DeliveryJob.perform_later(self)
  end
end
```

### Active Records make modeling easy.

Databases come to life with business logic encapsulated in rich objects. Modeling associations between tables, providing callbacks when saved, encrypting sensitive data seamlessly, and expressing SQL queries beautifully.

###### app/controllers/articles\_controller.rb

```ruby
class ArticlesController < ApplicationController
  def index
    @articles = Article.recent
  end

  def show
    @article = Article.find(params[:id])
    fresh_when etag: @article
  end

  def create
    article = Article.create!(article_params)
    redirect_to article
  end

  private
    def article_params
      params.require(:article).permit(:title, :content)
    end
end
```

### Action Controllers handle all requests.

Controllers expose the domain model to the web, process incoming parameters, set caching headers, and render templates, responding with either HTML or JSON.

###### app/views/articles/show.html.erb

```erb
<h1><%= @article.title %></h1>

<%= image_tag @article.cover_image.url %>

<p><%= @article.content %></p>

<%= link_to "Edit", edit_article_path(@article) if Current.user.admin? %>
```

### Action Views mix Ruby and HTML.

Templates can use the full versatility of Ruby, excessive code is extracted into helpers, and the domain model is used directly and interwoven with the HTML.

###### config/routes.rb

```ruby
Rails.application.routes.draw do
  resources :articles do    # /articles, /articles/1
    resources :comments     # /articles/1/comments, /comments/1
  end

  root to: "articles#index" # /
end
```

### Action Dispatch routes URLs.

Configure how URLs connect to the controllers using the routing domain language. Routes expose the bundle of actions that go together as a resource: index, show, new, create, edit, update, destroy.

Optimized for happiness.
========================

Rails has united and cultivated a strong tribe around a **wide set of heretical thoughts** about the nature of programming and programmers. Understanding these thoughts will help you understand the design of the framework.

[Read the Rails Doctrine](https://rubyonrails.org/doctrine)

Let’s get started.
==================

[###### Learning ### Read the guides. Learn what the frameworks can do and how they fit together.](https://guides.rubyonrails.org/)

[###### Contributing ### Contribute on GitHub. File bug reports and make pull-requests.](https://github.com/rails/rails)

[###### Keeping up ### See what’s new. The latest releases and updates on development.](https://rubyonrails.org/blog)

Learn more about [Hotwire](https://hotwired.dev/), the default front-end framework for Rails.

**Stay up to date** with Rails on [X](https://x.com/rails), [YouTube](https://www.youtube.com/@railsofficial), and [This Week in Rails](https://world.hey.com/this.week.in.rails).

[](https://rubyonrails.org/)

*   [Conduct](https://rubyonrails.org/conduct)
*   [Maintenance](https://rubyonrails.org/maintenance)
*   [Security](https://rubyonrails.org/security)
*   [Trademarks](https://rubyonrails.org/trademarks)
*   [License](https://opensource.org/licenses/MIT)

Links/Buttons:
- [[Rails World 2025] CFP is now open - submit by April 10](https://rubyonrails.org/2025/3/7/apply-to-speak-at-rails-world-2025)
- [](https://www.freeagent.com/)
- [Source](https://github.com/rails/rails)
- [Docs](https://rubyonrails.org/docs)
- [Community](https://rubyonrails.org/community)
- [News](https://rubyonrails.org/blog)
- [Events](https://rubyonrails.org/world)
- [Jobs](https://jobs.rubyonrails.org/)
- [Merch](https://merch.rubyonrails.org/)
- [Foundation](https://rubyonrails.org/foundation)
- [Rails 8.0.1 — released December 13, 2024](https://rubyonrails.org/2024/12/13/Rails-Version-8-0-1-has-been-released)
- [contributed code to Rails](https://contributors.rubyonrails.org/)
- [Read the Rails Doctrine](https://rubyonrails.org/doctrine)
- [Learning Read the guides. Learn what the frameworks can do and how they fit together.](https://guides.rubyonrails.org/)
- [Hotwire](https://hotwired.dev/)
- [X](https://x.com/rails)
- [YouTube](https://www.youtube.com/@railsofficial)
- [This Week in Rails](https://world.hey.com/this.week.in.rails)
- [Conduct](https://rubyonrails.org/conduct)
- [Maintenance](https://rubyonrails.org/maintenance)
- [Security](https://rubyonrails.org/security)
- [Trademarks](https://rubyonrails.org/trademarks)
- [License](https://opensource.org/licenses/MIT)
