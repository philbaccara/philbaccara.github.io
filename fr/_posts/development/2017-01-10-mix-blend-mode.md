---
layout: post
category: development
ref: mix-blend-mode
permalink: /fr/blog/developpement/:year/:month/:day/:title.html
lang: fr
title: "Premiers pas avec mix-blend-mode en CSS"
level: beginner
language: css
tags:
  - css
  - design
banner: design.jpg
ressources:
  - english:
    - title: "Spécifications W3C"
      href: "https://drafts.fxtf.org/compositing-1/"
    - title: "Introduction aux CSS blends modes par Chris Coyier"
      href: "https://css-tricks.com/basics-css-blend-modes/"
  - french:
    - title: "Introduction aux CSS blends modes par Chris Coyier, traduit par Pierre Choffé"
      href: "https://la-cascade.io/css-blend-modes-introduction/"
description: "Premiers pas avec la fonction CSS mix-blend-mode. Etude du cas simple d'une jauge avec un texte nécessitant une inversion de contraste pour le confort de lecture."
comments: true
---

Pour mon premier billet, je vous propose une introduction à la notion de [mix-blend-mode](https://www.w3.org/TR/compositing-1/){:target="\_blank"} en <abbr title="Cascading Style Sheets">CSS</abbr> qui m'a servi pour les jauges de compétences de mon CV. Comme son nom l'indique, cette fonction permet de "mélanger" un calque avec les éléments en dessous de lui ou son arrière-plan. Cet exemple nous servira également à approcher quelques notions nécessaire en <abbr title="Cascading Style Sheets">CSS</abbr> pour les nouveaux arrivants dans le monde des feuilles de styles tel que :

- Le positionnement *(position)*
- l'index de profondeur *(z-index)*
- la représentation des couleurs en décimal et hexadécimal *(rgb(0,0,0), #000000)*

Voici ce que nous obtiendrons à la fin de notre tuto qui ne sera pas un parcours de santé comme il pourrait le laisser croire aux premiers abords :

<p data-height="265" data-theme-id="dark" data-slug-hash="woEMjd" data-default-tab="result" data-user="taliesin" data-embed-version="2" data-pen-title="A simple meter with inverted text contrast" class="codepen">See the Pen <a href="https://codepen.io/taliesin/pen/woEMjd/">A simple meter with inverted text contrast</a> by Philippe Baccara (<a href="http://codepen.io/taliesin">@taliesin</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Comme vous pouvez le voir la couleur du texte change en fonction de la couleur de fond (fond blanc -> texte noir, fond noir -> texte blanc) nous permettant de respecter une règle essentielle en matière de design : **avoir en permanence un contraste suffisant permettant une lecture confortable**. J'en profite pour vous recommander le plugin [color-contrast-analyzer](https://chrome.google.com/webstore/detail/color-contrast-analyzer/dagdlcijhfbmgkjokkjicnnfimlebcll){:target="\_blank"} pour Chrome qui vous permettra d'évaluer le respect de cette règle sur la totalité de vos pages durant leur développement.

# Compatibilité

Comme toute fonction en <abbr title="Cascading Style Sheets">CSS</abbr>, il est nécessaire de d'abord se renseigner sur sa compatibilité avec les navigateurs principaux du marché grâce au site [caniuse.com](http://caniuse.com/#feat=css-mixblendmode){:target="\_blank"}. Je ne saurais vous recommander de mettre ce site dans vos favoris tant il vous sera indispensable si vous rencontrez des contraintes de compatibilité dans vos futurs travaux.

A l'heure où je rédige cet article, la compatiblité est plutôt bonne à condition de ne pas viser les navigateurs Internet Explorer et Opera Mini.

# Pré-requis

> Si vous n'êtes pas familier avec les notions de "masques" voici un article qui sera susceptible de vous intéresser. Pour faire simple, un masque est un calque dont le 'remplissage' définit la force de la fusion. Dans notre cas, nous considèrerons les valeurs par défaut :
>
>- blanc pour une opacité totale
>- noir pour une transparence totale

Il existe différents modes de fusion avec lesquels je vous recommande de "jouer", vous pourriez être surpris des résultats que l'on peut obtenir avec très peu d'efforts ! Tel qu'un effet vintage sur vos photos en faisant un "multiply" de votre photo avec un fond ocre ou violet, des effets de grattage, vieillissement, rayure, etc. en y surperposant une forme en svg ou une texture, etc.

<p class="notice--warning">Attention, cette fonction entraine un lourd traitement pour votre moteur de rendu ! Il est donc conseillé d'y recourir uniquement si vous avez besoin d'appliquer cet effet <strong>dynamiquement</strong> sinon, préférez le traitement en amont à l'aide d'un éditeur de photo (Photoshop, GIMP) puis affichez la photo déjà traitée.</p>

Notre cas est d'une grande simplicité afin d'aborder sereinement des notions, sommes toutes, assez complexes. Nous souhaitons juste obtenir une inversion de contraste sur le texte de notre jauge selon que ce dernier est sur un fond sombre ou clair.

# Un conteneur, des rectangles et un peu de texte

Commençons par notre code html qui va définir notre conteneur et nos divers "calques" :

```html
<body>
  <div class="meter">
    <div class="fill"></div>
    <span class="text">Notre texte</span>
    <div class="color"></div>
  </div>
</body>
```

Auquel on associe quelques règles <abbr title="Cascading Style Sheets">CSS</abbr> pour lui attribuer une taille, des bords et une couleur de fond. La seule notion complexe ici, si vous n'êtes pas familier avec le positionnement en <abbr title="Cascading Style Sheets">CSS</abbr>, est la valeur **"relative"** de l'attribut **"position"** dont je vous expliquerai le rôle indispensable plus loin dans cet article. Bref, voici ce que donne le <abbr title="Cascading Style Sheets">CSS</abbr> de notre conteneur **"meter"** :

```css
.meter {
  position: relative;
  width: 400px;
  height: 30px;
  border: 2px solid #4b6065;
  background-color: white;
}
```

Une bonne chose de faite ! Passons maintenant à la définition de notre premier calque qui va définir la zone d'effet ainsi que sa force de "fusion" grace à l'attribut **"background-color"** dont le rôle vous sera bientôt révélé, un peu de patience...

```css
.fill {
  width: 50%;
  height: 100%;

  background-color: black;

  z-index: 0;
}
```

Notre premier calque contient 3 paramètres importants dans l'effet que nous créons :

- Le premier est l'attribut **"width"** qui définit la largeur de notre élément qui correspond au "remplissage" de notre jauge. A vous d'en modifier la valeur selon vos besoins.
- Le deuxième est l'attribut **"z-index"** que j'ai défini à 0, qui est sa valeur par défaut, dans un souci de compréhension pour notre tuto. *(Afin de soulager le poids final de votre feuille de styles, il vous est tout à fait possible de supprimer cette ligne.)* Nous verrons plus loin pourquoi il est important que l'ordre de profondeur de nos calques soit respecté.
- Et enfin la couleur de fond, **"background-color"**, qui aura une importance fondamentale dans le rendu final de notre jauge.

Passons à notre calque contenant le texte de la jauge :

```css
.text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  line-height: 30px;
  font-weight: bold;
  text-align: center;

  color: white;
  mix-blend-mode: difference;

  z-index: 1;
}
```

# L'indispensable positionnement

> Si vous n'êtes pas familier de l'attribut <abbr title="Cascading Style Sheets">CSS</abbr> **"position"** je vous recommande vivement la lecture de cet [article](http://www.alsacreations.com/article/lire/533-initiation-au-positionnement-en-css-partie-1.html){:target="\_blank"}. La notion principale à comprendre est que le moteur de rendu de notre navigateur dessine nos éléments à partir de coordonnées (top, right, bottom, left) qui ont toutes besoin d'une origine pour avoir un sens.

- La valeur par défault des éléments est **"static"** qui définit que ces derniers sont dans ce qu'il est commun de nommé "flux". Pour faire simple, quand notre moteur de rendu génère notre page html, il récupère les éléments dans l'ordre où ils sont codés et les affiches brique par brique, les uns par rapports aux autres sans pour autant les lier entre eux directement. Ce qu'il faut retenir de la valeur "static" est qu'elle ne définit pas l'élément comme pouvant être une référence pour les coordonnées de ses enfants.
- La valeur **"initial"** établit toujours l'origine des coordonnées au coin supérieur gauche de notre page html.
- **"relative"** permet de "sortir" l'élément du "flux initial" tout en conservant sa position originelle au sein de ce dernier afin de lui permettre de devenir un référent pour l'affichage de ses enfants. Cependant, ce positionnement n'affecte pas les éléments du "flux" qui continuent de le voir comme s'il était toujours partie intégrante de ce dernier.
- **"fixed"**, quant à lui, définira l'origine du calcul des coordonnées au coin supérieur gauche de notre viewport (fenêtre d'affichage de notre navigateur), option très pratique pour les éléments "collants".
- Dans notre cas, nous utilisons la valeur **"absolute"** qui définit que l'élément voit l'origine de ses coordonnées initialisées à celles de l'élément parent. Si nous n'avions pas définit en "relative" le positionnement de notre conteneur, celui-ci aurait sa valeur par défaut à "static" qui renverrait l'origine des coordonnées de ses enfants à l'élément précédent ou parent et remonterait la chaine ainsi de suite jusqu'à rencontrer un élément dit "de référence" où jusqu'à remonter au dernier élément de notre page soit l'élément <body>. Etant définit en "relative", nous indiquons à notre moteur de rendu que les coordonnées de ses enfants seront donc relatives à ce dernier.

# Une histoire de profondeur

Nous souhaitons que nos calques se superposent sur la totalité de leur surface. Pour se faire nous prenons bien soin de lui attribuer un index de profondeur **"z-index"** supérieur à notre précédent calque afin qu'il apparaisse par-dessus notre précédent calque. Retenez qu'à index de profondeur égal, c'est l'ordre des éléments dans notre code html qui définira quel élément est au-dessus de l'autre. Même s'il n'est pas nécessaire dans notre cas d'attribuer un index de profondeur, j'ai pour habitude de le définir lorsque ce dernier à un rôle primordial dans la cohérence de rendu de ma page afin d'éviter des désagréments dû à un "copier-coller" foireux où à une saisie des éléments dans le désordre. A retenir, que l'indice de profondeur n'a d'effet que sur les éléments "positionnés".

# blanc - noir = ?

Enfin, nous ajoutons l'attribut **"mix-blend-mode"** avec pour valeur **"difference"** qui va donc indiquer que nous souhaitons "soustraire" la couleur la plus foncée de nos calques à la couleur la plus claire.

> Pour comprendre l'opération, il vous faut avoir quelques notions en hexadécimal. Si vous ne voulez pas avoir mal à la tête comprenez que l'hexadecimal est un système de numération en base 16, c'est à dire qu'il possède 16 symboles pour coder nos valeurs (0->1->2->3->4->5->6->7->8->9->A->B->C->D->E->F) quand le système décimal (base 10), celui que vous utilisez tous les jours, n'en contient que 10 (0->1->2->3->4->5->6->7->8->9).

> Nos couleurs s'étalent sur 3 canaux dans leur représentation "<abbr title="Red Green Blue">RGB</abbr>", chaque canaux disposant de 256 nuances soit 16² ce qui nous donne par canaux :
>
>- R => \[0, 255\] (base10) => \[00, FF\] (base16)
>- G => \[0, 255\] (base10) => \[00, FF\] (base16)
>- B => \[0, 255\] (base10) => \[00, FF\] (base16)
>
> Rappelez-vous également que le blanc est le résultat de l'addition de toutes les couleurs du spectre quand le noir est la présence d'aucune.
>
> Cela nous permet de comprendre la représentation décimale (base10) de nos couleurs : rgb(255, 255, 255) qui représente la couleur blanche et son équivalent en héxadécimal (base16) #FFFFFF (le "#" étant l'indicateur en <abbr title="Cascading Style Sheets">CSS</abbr> que nous renseignons une valeur en hexadécimal).

Il faut donc comprendre par "difference" la soustraction de ces valeurs pixel par pixel. Dans notre cas, seul 2 couleurs entre en jeux : le **noir** rgb(0, 0, 0) <=> #000000 et le **blanc** rgb(255, 255, 255) <=> #FFFFFF.

Dans les premiers 50% de notre jauge notre <abbr title="Cascading Style Sheets">CSS</abbr> soustrait le noir du calque ".fill" au blanc de notre texte ".text" ce qui nous donne :

<p class="notice--info" markdown="1">
(#FFFFFF - #000000) = #FFFFFF ou pour mieux comprendre ce qui se passe (rgb(255, 255, 255) - rgb(0, 0, 0)) =  rgb(255-0, 255-0, 255-0) = rgb(255, 255, 255) = blanc soit en litéral "*blanc* moins *noir* égal *blanc*".
</p>

Nous avons appliquer le "mix-blend-mode" à notre calque ".text" qui n'a pas de couleur de fond mais possède un attribut "color" sur lequel va s'appliquer l'effet et notre texte va donc prendre la valeur de cette soustraction à savoir "blanc".

Maintenant, les 50% restant de notre jauge qui laisse apparaitre la couleur de fond de notre conteneur à savoir "blanc". On refait la même opération :

<p class="notice--info" markdown="1">
(#FFFFFF - #FFFFFF) = #000000 ou (rgb(255, 255, 255,) - rgb(255, 255, 255)) = rgb(255-255, 255-255, 255-255) = rgb(0, 0, 0) = noir soit en litéral "*blanc* moins *blanc* égal *noir*".
</p>

Nous avons une jauge avec le contraste du texte qui s'inverse selon la couleur de fond comme prévu mais, le monochrome, même si c'est "passe-partout", ce n'est pas le top de ce qui peut être fait...

# Un peu de couleur

Passons à notre dernier **calque de fusion**. Celui-qui va définir la zone d'effet :

```css
.color {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background-color: #4b6065;
  mix-blend-mode: screen;

  z-index: 2;
}
```

Comme pour le calque précédent, nous le superposons aux deux précedents éléments sur la totalité de leurs surfaces puis nous lui attribuons une couleur de fond que nous souhaitons voir appliquée à notre texte ET à notre jauge.

Pour se faire, nous donnons à notre fonction "mix-blend-mode" la valeur de **"screen"** (inverse de multiply) qui, cette fois-ci, "multiplie" les couleurs inverses (ou complémentaires) de l'éléments avec celles d'arrière plan et restitue la valeur inverse (ou complémentaire). Et... tadaaaaaam !!! Vous voilà avec une jauge dont le texte restera lisible peu importe le taux de remplissage de cette dernière.

# Conclusion

Nous avons vu ici un exemple simple et "fonctionnel" du mix-blend-mode qui, bien qu'encore imparfait dans son support par les différents navigateurs du marché, laisse entrevoir des capacités bien plus puissantes de traitements d'images, nous ouvrant des portes jusque là verrouillées.

Notre exemple est volontairement simpliste dans un but didactique mais il est tout à fait possible d'effectuer des calques de fusion bien plus complexes notamment à l'aide du **svg** que je pense aborder dans un futur post.

&Agrave; bientôt...
