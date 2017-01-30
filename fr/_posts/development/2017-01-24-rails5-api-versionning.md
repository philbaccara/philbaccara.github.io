---
layout: post
category: development
ref: rails5-api-versionning
permalink: /fr/blog/developpement/:year/:month/:day/:title.html
lang: fr
title: "Versionner son API Rails 5"
level: middle
language: ruby
tags:
  - "Rails 5"
  - API
banner: web-services-api.jpg
ressources:
  - english:
    - title: "Un article de Troy Hunt qui a servit de base à ce billet."
      href: "https://www.troyhunt.com/your-api-versioning-is-wrong-which-is/"
    - title: "Dépôt Github de la gem Versionist créée par Brian Ploetz"
      href: "https://github.com/bploetz/versionist"
  - french:
    - title: "Page wikipedia sur le protocole HTTP"
      href: "https://fr.wikipedia.org/wiki/Hypertext_Transfer_Protocol"
    - title: "Page wikipedia sur les URLs"
      href: "https://fr.wikipedia.org/wiki/Uniform_Resource_Locator"
    - title: "Page wikipedia sur les formats de données MIME"
      href: "https://fr.wikipedia.org/wiki/Type_MIME"
    - title: "Page wikipedia sur les DNS"
      href: "https://fr.wikipedia.org/wiki/Domain_Name_System"
    - title: "Définition d'une API"
      href: "https://fr.wikipedia.org/wiki/Interface_de_programmation"
    - title: "Documentation de RubyOnRails sur le Routing"
      href: "http://guides.rubyonrails.org/routing.html"
description: "Comment versionner son API Rails5."
comments: true
---
Tout ceux qui se sont employés à développer une <abbr title="Application Programming Interface">API</abbr> se sont retrouvés un jour ou l'autre à devoir rivaliser d'ingéniosité pour communiquer sur les mises à jour de leurs services à leurs utilisateurs et pourtant feront l'écueil de voir leur messagerie, au mieux, remplie de messages d'utilisateurs ayant des difficultés à atteindre la nouvelle version et ses super nouveautés !

# Introduction

Petit rappel de ce qu'est une <abbr title="Application Programming Interface">API</abbr> pour les nouveaux venus dans le monde merveilleux des services Web. Une <abbr title="Application Programming Interface">API</abbr>, ou Application Programming Interface, est comme son nom l'indique une "interface". &Agrave; l'instar de la télécommande de votre téléviseur qui vous permet de lui indiquer quel service vous souhaitez qu'elle vous rende, une <abbr title="Application Programming Interface">API</abbr> n'est autre que cette télécommande qui vous permet de récupérer vos précieuses données ou d'accéder au service tant désiré.

<div class="notice--info" markdown="1">
  Quelques exemples simple d'usages d'<abbr title="Application Programming Interface">API</abbr>s populaires :

  - les services d'authentification de sites de réseaux sociaux qui vous permettent en quelques lignes de codes de vous connecter à leurs services afin d'en récupérer les données nécessaires à l'authentification de l'utilisateur déjà inscrit chez eux.
  - les services de paiement en ligne
  - les services de publicités
  - les services de géolocalisation
  - les analyseurs de trafic
  - etc.
</div>

Les <abbr title="Application Programming Interface">API</abbr>s sont nombreuses et deviennent de plus en plus la norme dans un monde où l'ordinateur partage de plus en plus régulièrement ses tâches avec votre smartphone et où la distribution des services est grandement facilitée par des réseaux toujours plus preformants. Développer une <abbr title="Application Programming Interface">API</abbr> en plus de son site Web est une décision stratégique qui se doit d'être mûrement réfléchit : stratégies d'accès, exposition des données, etc.

<div class="notice--info" markdown="1">
  Le choix d'une interface de programmation est idéal si vous envisagez au moins un des cas suivants :

  - consommations de vos données par des plate-formes multiples (site internet, ERP, application smartphone, etc.)
  - offre de services à des tiers extérieurs
</div>

# Pourquoi "versionner" ?

Que faire si je souhaite apporter un changement majeur à mon service sans mettre par terre tous les sites clients connectés à mon interface ? Comment puis-je amener les utilisateurs de mon service à migrer progressivement selon leurs propres contraintes ? Comment me permettre de ne plus avoir à maintenir une version obsolète de mon service afin de soulager mes coûts d'entretiens ? etc.

Comme tout service ouvert vers l'extérieur, le support client, la maintenance et la capacité du service à s'adapter et à évoluer est primordial. Pour se faire, le versionnement de nos <abbr title="Application Programming Interface">API</abbr>s est un point crucial dans notre stratégie de développement et se doit d'avoir été étudié avec beaucoup de précautions.

Considérer au bout de quelques mois que notre v2 sera immédiatement adoptée par tout le monde car cent fois mieux que notre v1 c'est ne pas prendre en compte les inerties propres au fonctionnement de toutes structures. Il est donc important de pouvoir assurer une transition indolore pour vos clients ainsi qu'un support de vos versions antérieures, aussi déplaisant que celà puisse être. Il nous faut donc déployer une stratégie de versionnement permettant d'accéder à nos différentes versions avec le minimum de contraintes possible afin de ne pas perdre nos utilisateurs passés, présents et futurs.

# Quelle stratégie pour notre versionnement

Lors de mon premier développement d'<abbr title="Application Programming Interface">API</abbr>, je ne me suis pas posé trop de questions et ai adopté la stratégie que j'avais jugé la plus répendue, c'est à dire par "path" (ne vous inquiétez pas je vous explique plus bas cette stratégie...). Pas de sous-domaine, pas d'alternative au requêtage de mon <abbr title="Application Programming Interface">API</abbr>... L'utilisateur devait se conformer à la norme d'usage que je lui imposait, point ! Cela a ses avantages : une documentation claire et une maintenance facile. Cependant, l'utilisateur peut y trouver certaines frustrations : habitudes d'usage des <abbr title="Application Programming Interface">API</abbr>s divergentes, une philosophie de développement chevillée au corps qui ne l'autorise pas à se renier et bien d'autres raison dont nous ne pouvons être juge. Nous sommes là pour fournir un service au plus grand nombre et devons oeuvrer en ce sens autant que faire se peut.

<div class="notice--important" markdown="1">
  Trois choses sont nécessaire pour une compréhension de notre service par nos utilisateurs :

  - signifier dans notre <abbr title="Uniform Resource Locator">URL</abbr> qu'on accède à l'<abbr title="Application Programming Interface">API</abbr> de notre service Web. Ce point est particulièrement important quand vous aurez une application qui partagera le nom de domaine de cette dernière et en consommera les services
  - indiquer dans notre <abbr title="Uniform Resource Locator">URL</abbr> la version afin de permettre une évolution sereine de notre service
  - informer des formats de données délivrable par notre <abbr title="Application Programming Interface">API</abbr>
</div>

Nous verrons donc que chaque stratégie à ses avantages et ses défauts et pourquoi il est intéressant d'intégrer les trois afin de s'assurer de ne perdre aucun utilisateur et ce, pour très peu d'efforts.

## Path

<div class="notice--info" markdown="1">
  Tout d'abord, rappelons nous rapidement la structure d'une <abbr title="Uniform Resource Locator">URL</abbr>, par exemple : **http://www.mon-site.dev:3000/users/index.html?version=1&lang=fr**

  - **http://** -> indique le **protocole de communication** utilisé pour l'accès/transfert des données (*ftp://, mailto:, telnet://, https://, etc.*).
  - **www.** -> est le **sous-domaine** de notre <abbr title="Uniform Resource Locator">URL</abbr>.
  - **mon-site** -> est le **nom de domaine de second niveau** de notre site.
  - **.dev** -> est notre **nom de domaine de premier niveau**. Il était principalement utilisé pour définir la nature du site (.org, .info, .gouv, .dev, etc.) ou sa localisation (*.fr, .en, .us, .it, etc.*). Aujourd'hui, les noms de premier niveau ont été étendus pour répondre à la saturation des réservations de noms de domaines (*.me, .blog, .shop, etc.*).
  - **:3000** -> désigne le **port** du serveur sur lequel on souhaite se connecter.
  - **/users/index.html** -> est notre **chemin** par lequel nous indiquons quelle page/donnée nous souhaitons atteindre. Dans l'usage des <abbr title="Application Programming Interface">API</abbr>, il est commun d'appeler le noeud de données ainsi atteint un "endpoint".
  - **?version=1&lang=fr** -> le "?" signifie que tous les éléments le suivant seront des **paramètres de requête** représentés par une association clé=valeur (ex: version=1). Pour chainer ces paramètres il suffit de les séparer d'un ampersand "&".

  Pour plus de détails, n'hésitez pas à consulter la page [wikipedia](https://fr.wikipedia.org/wiki/Uniform_Resource_Locator){:target="\_blank"} sur les <abbr title="Uniform Resource Locator">URL</abbr>s.
</div>

Revenons en à notre sujet...

Cette stratégie consiste donc à atteindre nos données en précisant la version directement dans le chemin de notre uri via l'imbriquement de nos "endpoints" dans un répertoire faisant explicitement référence à la version désirée.

*Exemple : http://www.mon-site.dev/v1/users/index.json*

Dans l'exemple suivant, on constate immédiatement la faiblesse en terme d'intégibilité de notre <abbr title="Uniform Resource Locator">URL</abbr>. Nous nous retrouvons avec une <abbr title="Uniform Resource Locator">URL</abbr> qui, sémantiquement parlant, mélange la version de notre <abbr title="Application Programming Interface">API</abbr> à l'entité demandée. Un nombre croissant de développeurs attachent une attention particulière à la normalisation des standards du Web afin d'en faciliter l'accès et son expansion, et travaille en particulier à la sémantique. &Agrave; vous de voir si vous y attachez la même importance, si tel est le cas alors passez directement à la stratégie <abbr title="HyperText Transfer Protocol">HTTP</abbr> Header qui est la seule à ne pas rompre la sémantique de notre <abbr title="Uniform Resource Locator">URL</abbr>. Pour ma part, cela ne m'a pas dérangé pendant toutes ces années d'utiliser un "v1" précédent mes chemins d'accès et considère qu'il y a du bon (<abbr title="Uniform Resource Locator">URL</abbr> claire) et du moins bon (HTTP Header plus difficile à comprendre pour les débutants).

<div class="notice--important" markdown="1">
  **Avantages :**

  - Facile à mettre en oeuvre
  - <abbr title="Uniform Resource Locator">URL</abbr> facilement compréhensible...

  **Inconvénients :**

  - ... mais sémantiquement invalide
</div>

## HTTP Header

Cette stratégie est très intéressante car elle permet de conserver une <abbr title="Uniform Resource Locator">URL</abbr> "propre" qui ne désigne que l'entité souhaitée sans avoir à en préciser la version. En plus, nous verrons qu'elle permet de définir une version par défaut. Cependant, son principal inconvénient concerne sa mise en oeuvre qui nécessite d'éditer le Header de notre requête <abbr title="HyperText Transfer Protocol">HTTP</abbr> et d'en comprendre les règles. La tâche n'est pas triviale et nous essaierons dans comprendre l'essentiel.

<div class="notice--important" markdown="1">
  **Avantages :**

  - <abbr title="Uniform Resource Locator">URL</abbr> propre, claire et sémantiquement valide
  - Possibilité de définir une version par défaut côté serveur

  **Inconvénients :**

  - Mise en oeuvre nécessitant une connaissance du Header du protocole <abbr title="HyperText Transfer Protocol">HTTP</abbr>
  - Difficulté du partage des <abbr title="Uniform Resource Locator">URL</abbr>s de nos endpoints si pas de version définie par défaut
</div>

## Request Parameter

Peut-être la stratégie la moins élégante et la plus dispensable. Voyons quand même à quoi elle ressemble...

Reprenons notre <abbr title="Uniform Resource Locator">URL</abbr> :

<p class="notice--info" markdown="1">
  http://ww.mon-site.dev/users/index.json
</p>

... et rajoutons lui la version de notre <abbr title="Application Programming Interface">API</abbr> en paramètre :

<p class="notice--info" markdown="1">
  http://ww.mon-site.dev/users/index.json?version=1
</p>

<div class="notice--important" markdown="1">
  **Avantages :**

  - Très facile à mettre en oeuvre

  **Inconvénients :**

  - Surchargement des paramètres de l'<abbr title="Uniform Resource Locator">URL</abbr>
  - Pas très élégant...
</div>

# Mise en place avec Rails 5

Nous allons mettre en place nos stratégies **sans** et **avec** l'aide de la gem '[Versionist](https://github.com/bploetz/versionist){:target="\_blank"}'.

## Sous domaine

Commençons par répondre à la première nécessité que nous avons évoqué plus haut : signifier aux utilisateurs que nous consommons un service de type <abbr title="Application Programming Interface">API</abbr>.

<div class="notice--info" markdown="1">
  Deux méthodes s'offrent à nous :

  - La première est de le définir dans notre chemin d'<abbr title="Uniform Resource Locator">URL</abbr> : **http://www.mon-site.dev/<u>api</u>/**
  - la deuxième, qui a ma préférence, est de le définir dans le sous-domaine de notre <abbr title="Uniform Resource Locator">URL</abbr> : **http://<u>api</u>.mon-site.dev/**
</div>

Créons notre arborescence de répertoires pour organiser nos "controllers" et faire en sorte qu'en toutes circonstances, nous et nos collaborateurs n'auront pas trop à souffrir pour faire évoluer notre service. En effet, nous souhaitons développer une <abbr title="Application Programming Interface">API</abbr> mais qui sait de quoi est fait l'avenir et peut-être souhaiterez vous développer un site Web "classique" à l'aide des outils de Ruby On Rails. C'est pourquoi, je vous conseille d'adopter l'arborescence suivante :

```
mon-site
 |-app
    |-controllers
       |-api
          |-v1
            |- api_controller.rb
            |- users_controller.rb
            |- ...
          |-v2
            |- api_controller.rb
            |- users_controller.rb
            |- ...
```

plutôt que :

```
mon-site
 |-app
    |-controllers
       |-v1
          |- api_controller.rb
          |- users_controller.rb
          |- ...
       |-v2
          |- api_controller.rb
          |- users_controller.rb
          |- ...
```

Ainsi, lorsque vous souhaiterez ajouter un site à l'aide de Rails, il vous suffira d'ajouter vos "controllers" spécifiques à la racine du répertoire "controllers" ou dans un sous-répertoire dédié. Je comprends que l'ajout d'un répertoire "api" peut paraître futile mais pour l'effort supplémentaire que cela nécessite vous vous prémunissez de bien des déboires s'il advenait que vous changiez d'avis.

Vous aurez remarqué l'absence du fichier "application_controller.rb" remplacé par le fichier "api_controller.rb" que je trouve plus clair, voici son contenu :

```ruby
# app/controllers/api/v1/api_controller.rb

module Api::V1
  class ApiController < ApplicationController
    # Insérer ici vos actions globales pour la version 1 de votre API
  end
end
```

&Eacute;ditons notre cher fichier "config/routes.rb" pour répondre à notre sous-domaine  :

```ruby
# config/routes.rb

# sans Versionist
Rails.application.routes.draw do

  constraints subdomain: 'api' do
    scope module: 'api' do
      resources :users
    end
  end

end
```

Pour l'instant, notre configuration ne prend pas en compte l'architecture de notre <abbr title="Application Programming Interface">API</abbr> à laquelle nous avons intégré un versionnement et ne fonctionne donc pas pour l'instant...

Nous avons donc indiqué à Rails que nous souhaitons contraindre les requêtes entrantes à devoir contenir dans l'"objet de requête" le fait qu'elle souhaite interroger le sous-domaine "api" de notre application pour pouvoir accéder aux ressources déclarées dans notre block. Puis, nous indiquons que nos ressources sont contenues dans un module nommé "api". Rappellez-vous quand nous avons créé le fichier "app/controllers/api/v1/api_controller.rb" nous avons encapsulé notre classe dans le module "Api::V1" de la sorte :

```ruby
module Api::V1
  # ...
end
```

Nous avons donc configuré la première partie du chemin à parcourir pour atteindre nos ressources passons donc au choix de notre stratégie de versionnement est implémentons là...

## Path

Pour accéder à la liste de nos utilisateurs nous souhaitons que notre <abbr title="Uniform Resource Locator">URL</abbr> ressemble à ceci :

<div class="notice--info" markdown="1">
  **http://api.mon-site.dev/v1/users/index.json**
</div>

Il nous faut donc conserver la déclaration de notre sous-domaine et lui indiquer que nos chemins seront précédés de la version. Commençons par la version sans la gem *versionist*

```ruby
# config/routes.rb

# sans la gem versionist
Rails.application.routes.draw do

  constraints subdomain: 'api' do
    scope module: 'api' do
      namespace :v1,  defaults: { format: :json } do
        resources :users
        # Insérez ici l'ensemble de vos "routes"
      end
    end
  end

end
```

Un petit "rails routes" dans votre console favorite vous donnera un résultat du genre de celui-ci :

```
Prefix Verb   URI Pattern             Controller#Action
v1_users GET    /v1/users(.:format)     api/v1/users#index {:subdomain=>"api", :default=>:json}
       POST   /v1/users(.:format)     api/v1/users#create {:subdomain=>"api", :default=>:json}
v1_user GET    /v1/users/:id(.:format) api/v1/users#show {:subdomain=>"api", :default=>:json}
       PATCH  /v1/users/:id(.:format) api/v1/users#update {:subdomain=>"api", :default=>:json}
       PUT    /v1/users/:id(.:format) api/v1/users#update {:subdomain=>"api", :default=>:json}
       DELETE /v1/users/:id(.:format) api/v1/users#destroy {:subdomain=>"api", :default=>:json}
```

Nous pouvons voir que notre chemin d'accès (<abbr title="Uniform Resource Identifier">URI</abbr> Pattern) ne fait pas mention de "api" tandis que le chemin de nos controllers respectent bien l'imbrication de nos modules pour accéder à nos ressources.

```ruby
# config/routes.rb

# avec la gem versionist
Rails.application.routes.draw do

  api_version( module: "Api::V1",
               defaults: { format: :json },
               path: { value: "v1" } ) do
    resources :users
    # Insérez ici l'ensemble de vos "routes"
  end

end
```

Refaisons notre "rails routes" pour voir la différence avec notre implémentation sans l'aide de la gem "versionist" :

```
Prefix Verb   URI Pattern             Controller#Action
v1_users GET    /v1/users(.:format)     api/v1/users#index {:format=>:json}
       POST   /v1/users(.:format)     api/v1/users#create {:format=>:json}
v1_user GET    /v1/users/:id(.:format) api/v1/users#show {:format=>:json}
       PATCH  /v1/users/:id(.:format) api/v1/users#update {:format=>:json}
       PUT    /v1/users/:id(.:format) api/v1/users#update {:format=>:json}
       DELETE /v1/users/:id(.:format) api/v1/users#destroy {:format=>:json}
```

On peut voir que notre chemin d'accès ne fait également pas mention de "api" car la gem "versionist" effectue, par défaut, la configuration d'un sous-domaine api sans qu'on ait à lui dire explicitement.

Voilà, la première stratégie implémentée passons à celle qui nous demandera un peu plus d'efforts.

## HTTP Header

Nous souhaitons que notre <abbr title="Application Programming Interface">API</abbr> réponde à la requête suivante :

<div class="notice--info" markdown="1">
  **HTTP GET:**

  **http://api.mon-site.dev/users/index.json**

  **Accept: application/vnd.mon-site.dev[.version].param[+json]**
</div>

En parcourant d'autres billets de blogs sur le sujet j'ai pu croiser ce type de format de requête :

<div class="notice--info" markdown="1">
  **HTTP GET:**

  **http://api.mon-site.dev/users/index.json**

  **Accept: application/vnd.mon-site.dev+json; version=1**
</div>

Qui requiert juste d'adapter le "matching" du "constraints" de notre "routing" mais pour notre exemple nous implémenterons la première requête "à la" manière de [Github](https://developer.github.com/v3/media/){:target="\_blank"}.

Commençons par bien comprendre la composition de notre requête...

Nous avons d'abord la déclaration de l'action "<abbr title="HyperText Transfer Protocol">HTTP</abbr> GET" qui indique que nous souhaitons accéder en "lecture" à l'aide du protocole "<abbr title="HyperText Transfer Protocol">HTTP</abbr>" aux données du serveur.

Ensuite, nous avons notre <abbr title="Uniform Resource Locator">URL</abbr> qui indique au service <abbr title="Domain Name System">DNS</abbr> l'adresse où nous souhaitons nous rendre et le sous-domaine ansi que le chemin d'accès aux ressources que nous souhaitons récupérer.

Enfin, nous définissons le paramètre "Accept" de notre requête ainsi : "Accept: application/vnd.mon-site.dev+json; version=1". Décomposons ensemble cette ligne :

- **application** : définit le type de "media"
- **vnd.** : indique que nous souhaitons accéder à un "media" "standard" dicté par le [<abbr title="Request For Comments">RFC</abbr>4288-3.2](https://tools.ietf.org/html/rfc4288#section-3.2){:target="\_blank"}
- **mon-site.dev** : agit comme une sorte de "namespace" indiquant des ressources spécifiques
- **[.version]** : indique la version dont nous souhaitons récupérer les données. Dans notre cas, nous remplacerons "[.version]" par ".v1" pour atteindre la version 1 de notre <abbr title="Application Programming Interface">API</abbr>).
- **.param[+json]** : informe sur le format dans lequel nous souhaitons recevoir nos données. Dans notre cas, nous remplacerons ".param[+json]" par "+json".

```ruby
# config/routes.rb

# sans la gem versionist
Rails.application.routes.draw do

  constraints subdomain: 'api' do
    scope module: 'api' do
      scope module: 'v1', constraints: lambda { |request| request.headers['Accept'].include?("application/vnd.mon-site.dev.v1") } do
        resources :users
      end
    end
  end

end
```

```ruby
# config/routes.rb

# avec la gem versionist
Rails.application.routes.draw do

  api_version( module: "Api::V1",
               defaults: { format: :json },               
               header: { name: "Accept",
                         value: "application/vnd.mon-site.dev.v1+json"} ) do
    resources :users
    # Insérez ici l'ensemble de vos "routes"
  end

end
```

Nous pouvons définir une version par défaut afin qu'une requête dont la version ne serait pas renseignée n'aboutirait plus à une erreur 404.

<div class="notice--warning" markdown="1">
  Attention, définir une version par défaut fera que tous vos clients ne faisant pas explicitement référence à une version dans leurs requêtes verront leur implémentation de votre service être brisée dès que vous mettrez en ligne une nouvelle version !

  Comme tout ce qui a été dit dans cet article, c'est à vous de voir quelle stratégie vous souhaitez adopter.
</div>

Voici à quoi ressemble notre requête sans que la version soit explicitement précisée :

<div class="notice--info" markdown="1">
  **HTTP GET:**

  **http://api.mon-site.dev/users/index.json**

  **Accept: application/vnd.mon-site.dev+json**
</div>

L'ajout d'une valeur par défaut nous oblige à implémenter une classe nous permettant de gérer cette dernière.

Commençons par créer un fichier dans le répertoire 'lib' que nous nommerons 'api_constraints.rb' :

```ruby
# lib/api_constraints.rb

class ApiConstraints

  def initialize(options)
    @version = options[:version]
    @default = options[:default]
  end

  def matches?(request)
    @default || request.headers['Accept'].include?("application/vnd.mon-site.dev.v#{@version}")
  end  
end
```

Il nous est possible à présent d'utiliser notre classe dans notre fichier de "routing" pour prendre en compte la valeur par défaut :

<p class="notice--warning">
  Prenez garde à ne jamais définir par défaut deux versions en même temps !
</p>

```ruby
# config/routes.rb

# sans la gem versionist
Rails.application.routes.draw do

  constraints subdomain: 'api' do
    scope module: 'api' do
      scope module: 'v1', constraints: ApiConstraints.new(version: 1, default: true) do
        resources :users
      end
    end
  end

end
```

L'implémentation avec la gem "versionist" qui nous simplifie grandement la tâche :

```ruby
# config/routes.rb

# avec la gem versionist
Rails.application.routes.draw do

  api_version( module: "Api::V1",
               defaults: { format: :json },
               header: { name: "Accept",
                         value: "application/vnd.mon-site.dev.v1+json"},
               default: true ) do
    resources :users
  end

end
```

Lancez un petit ```curl -v -H "Accept: application/vnd.mon-site.dev.v1+json" http://api.mon-site.dev:3000/users"``` et vous devriez avoir la liste de vos utilisateurs (à condition d'avoir implémenter la méthode "index" dans le controller "app/controllers/api/v1/users_controller.rb" bien sûr !).

## Request Parameter

Voyons le format de requête auquel nous souhaitons permettre apporter une réponse :

<div class="notice--info" markdown="1">
  **http://api.mon-site.dev/users/index.json?version=1**
</div>

```ruby
# config/routes.rb

# sans la gem versionist
Rails.application.routes.draw do

  constraints subdomain: 'api' do
    scope module: 'api' do
      scope module: 'v1', constraints: lambda { |request| request.params['version'].to_s && request.params['version'] == '1' } do
        resources :users
      end
    end
  end

end
```

```ruby
# config/routes.rb

# avec la gem versionist
Rails.application.routes.draw do

  api_version( module: "Api::V1",
               defaults: { format: :json },
               parameter: { name: "version",
                            value: "1" } ) do
    resources :users
    # Insérez ici l'ensemble de vos "routes"
  end

end
```

## 3 en 1

Si vous ne souhaitez pas utiliser la gem versionist, pour avoir les trois stratégies, il vous suffit de les implémenter les unes après les autres. Malheureusement, cela vous obligera à répéter toutes vos "routes" pour chaques stratégies...

Si vous utilisez la gem "versionist" alors voici le code nécessaire pour les trois stratégies sans valeur par défaut :

```ruby
# config/routes.rb

# avec la gem versionist
Rails.application.routes.draw do

  api_version( module: "Api::V1",
               defaults: { format: :json },
               header: { name: "Accept",
                         value: "application/vnd.mon-site.dev.v1+json"},
               path: { value: "v1" },
               parameter: { name: "version",
                            value: "1" } ) do
    resources :users
    # Insérez ici l'ensemble de vos "routes"
  end

end
```

... et avec :

```ruby
# config/routes.rb

# avec la gem versionist
Rails.application.routes.draw do

  api_version( module: "Api::V1",
               defaults: { format: :json },
               header: { name: "Accept",
                         value: "application/vnd.mon-site.dev.v1+json"},
               path: { value: "v1" },
               parameter: { name: "version",
                            value: "1" },
               default: true ) do
    resources :users
    # Insérez ici l'ensemble de vos "routes"
  end

end
```

# Test avec Rspec

Il est tout à fait possible de tester nos trois stratégies. Voici quelques exemples simplistes de tests de base à adapter à vos "models" et "controllers" :

```ruby
# spec/requests/api/v1/users_controller_specs.rb

require 'rails_helper'

describe Api::V1::UsersController do

  before(:each) do
    @user = User.create! id: 1, name: 'John Doe'
  end

  it "request with HTTP Header strategy should get users from v1" do
    get '/users', params: {}, headers: {'Accept' => 'application/vnd.mon-site.dev.v1+json'}
    expect(response).to be_success
    payload = JSON.parse(response.body)
    expect(payload.length).to eql(1)
  end

  it "request with path strategy should get users from v1" do
    get '/v1/users', params: {}, headers: {}
    expect(response).to be_success
    payload = JSON.parse(response.body)
    expect(payload.length).to eql(1)
  end

  it "request with paramater strategy should get users from v1" do
    get '/users?version=v1', params: {}, headers: {}
    expect(response).to be_success
    payload = JSON.parse(response.body)
    expect(payload.length).to eql(1)
  end

  it "request v9 should get v1 by default" do
    get '/users', params: {}, headers: {'Accept' => 'application/vnd.jam-session.dev; version=9'}
    expect(response).to be_success
    payload = JSON.parse(response.body)
    expect(payload.length).to eql(1)
  end

  it "request with HTTP Header strategy without version specified should get users from v1" do
    get '/users', params: {}, headers: {'Accept' => 'application/vnd.mon-site.dev+json'}
    expect(response).to be_success
    payload = JSON.parse(response.body)
    expect(payload.length).to eql(1)
  end
end
```

# Conclusion

Vous voilà avec une <abbr title="Application Programming Interface">API</abbr> versionnée laissant le choix à vos utilisateurs de choisir parmis trois stratégies pour interroger votre service. &Eacute;conomisez-vous la réflexion de devoir trancher pour une stratégie plutôt qu'une autre car vous perdrez juste un temps précieux et employez plutôt dix minutes de votre temps à implémenter les trois. Vous serez ainsi débarassé du fardau de devoir contrarier vos utilisateurs bien que, en toute franchise, ce n'est pas cet aspect de votre application qui décidera du succès ou non de cette dernière, mais autant offrir un service permettant un maximum de libertés quand nous en avons la possiblité, non ?!
