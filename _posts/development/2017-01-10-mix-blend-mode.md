---
layout: post
ref: mix-blend-mode
permalink: /en/blog/development/:year/:month/:day/:title.html
lang: en
title: "First step with mix-blend-mode from CSS"
category: development
level: beginner
language: css
tags:
  - css
  - design
banner: design.jpg
ressources:
  - english:
    - title: "W3C specifications"
      href: "https://drafts.fxtf.org/compositing-1/"
    - title: "Introduction to CSS blends modes by Chris Coyier"
      href: "https://css-tricks.com/basics-css-blend-modes/"
  - french:
    - title: "Introduction to CSS blends modes by Chris Coyier, translated by Pierre Choffé"
      href: "https://la-cascade.io/css-blend-modes-introduction/"
description: "First steps with CSS mix-blend-mode. Study of a simple case of a gauge with a text requiring an inverted contrast for reading comfort."
comments: true
---

For my first post on this blog, I propose to you an introduction to the notion of  [mix-blend-mode](https://www.w3.org/TR/compositing-1/){:target="\_blank"} in <abbr title="Cascading Style Sheets">CSS</abbr> who served me for the skills gauges of my CV. As its name suggests, this function allows you to "mix" a layer with the elements below it or its background. This example will also serve to introduce some of the <abbr title="Cascading Style Sheets">CSS</abbr> for newcomers in the world of the stylesheets such as:

- the positionning *(position)*
- the depth index *(z-index)*
- the representation of colors in decimal and hexadecimal *(rgb(0,0,0), #000000)*

Here is what we'll get at the end of our tutorial which will not be a health course as it could be believed at the first glance:

<p data-height="265" data-theme-id="dark" data-slug-hash="woEMjd" data-default-tab="result" data-user="taliesin" data-embed-version="2" data-pen-title="A simple meter with inverted text contrast" class="codepen">See the Pen <a href="https://codepen.io/taliesin/pen/woEMjd/">A simple meter with inverted text contrast</a> by Philippe Baccara (<a href="http://codepen.io/taliesin">@taliesin</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

As you can see the text color change depending on the background color (white background -> black text, black background -> white text) allowing us to respect an essential rule of design: **to have constantly enough contrast allowing a comfortable reading**. I take this opportunity to recommend the plugin called [color-contrast-analyzer](https://chrome.google.com/webstore/detail/color-contrast-analyzer/dagdlcijhfbmgkjokkjicnnfimlebcll){:target="\_blank"} for Chrome which will allow you to evaluate the respect of this rule on all your pages during their development.

# Compatibility

Like any function in <abbr title="Cascading Style Sheets">CSS</abbr>, it's necessary to first inquire about its compatibility with main browsers of the market, thanks to the website [caniuse.com](http://caniuse.com/#feat=css-mixblendmode){:target="\_blank"}. I cannot recommend you to put this site in your favorites as it will be essential if you encounter constraints of compatibility in your future works.

At the time of writing this article, the compatibility is rather good provided to not aim Internet Explorer and Opera Mini.

# Pré-requisites

> If you aren't familiar with the "masks" notions here is an article that will interest you. To make it simple, a mask is a layer whose 'filling' defines the strength of the fusion. In our case, we will consider the default values:
>
>- white for maximum opacity
>- black for maximum transparency

There are different fusion modes with which I recommend you to "play", you might be surprised at the results that can be achieved with very little effort ! As a vintage effect on your photos by making a "multiply" of your photo with an ocher or purple background, effects of scratching, aging, scratching, etc. By superposing on it a svg or a texture, and so on.

<p class="notice--warning">Attention, this function involves a heavy treatment for your rendering engine ! It's therefore advisable to use it only if you need to apply this effect <strong>dynamically</strong> otherwise, prefer the upstream processing using a picture editor (Photoshop, GIMP) then display the already treated picture.</p>

Our case is really simple in order to serenely introduce a couple of rather complex notions. We just want to get a contrast inversion on the text of our gauge depending on whether the latter is on a dark or light background.

# A container, rectangles and some texts

Let's start with our html code that will define our container and our various "layers":

```html
<body>
  <div class="meter">
    <div class="fill"></div>
    <span class="text">Our text</span>
    <div class="color"></div>
  </div>
</body>
```
To which one we associate some <abbr title = "Cascading Style Sheets">CSS</abbr> rules to give it a size, edges and a background color. The only complex notion here, if you are not familiar with the positioning in <abbr title="Cascading Style Sheets">CSS</abbr>, is the **relative** value of the **"Position"** attribute, I will explain the essential role of it later in this article. In short, here is what the <abbr title="Cascading Style Sheets">CSS </abbr> gives of our container called **"meter"**:

```css
.meter {
  position: relative;
  width: 400px;
  height: 30px;
  border: 2px solid #4b6065;
  background-color: white;
}
```
A good thing done ! Let's now go to the definition of our first layer which will define the effect zone and its "fusion" strength thanks to the **"background-color"** attribute whose role will soon be revealed to you, be patient...

```css
.fill {
  width: 50%;
  height: 100%;

  background-color: black;

  z-index: 0;
}
```

Our first layer contains 3 important parameters for the effect we create:

- The first is the **width** attribute which defines the width of our element that corresponds to the "fill" of our gauge. You can change the value to your needs.
- The second is the **"z-index"** attribute that I set to 0, which is its default value, in an understanding concern for our tutorial. *(In order to lighten the final weight of your stylesheet, it's possible to delete this line.)* We will see later why it's important to preserve the depth order of our layers.
- And finally the **"background-color"** which will have a fundamental importance in the final rendering of our gauge.

Let's go to our layer containing the text of the gauge:

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

# The indispensable positioning

> If you aren't familiar with the <abbr title="Cascading Style Sheets">CSS</abbr> **"position"** attribute I recommend the reading of this [article](http://www.barelyfitz.com/screencast/html-training/css/positioning/){:target="\_blank"}. The main notion to understand is that the rendering engine of our browser draws our elements from coordinates (top, right, bottom, left) that all needs an origin to make sense.

- The default value of the elements is **"static"** which defines that these are in what it is common to call "flow". To make it simple, when our rendering engine generates our html page, it retrieves the elements in the order they're coded and display them one by one, in relation to each other without linking them directly. What to remember about the "static" value is that it doesn't define the element as being a reference for the coordinates of its children.
- The **initial** value always sets the origin of the coordinates in the upper left corner of our html page.
- **"relative"** allows to "take out" the element of the "initial flow" while maintaining its original position within the latter in order to allow it to become a referent for the display of its children. However, this positioning doesn't affect the elements of the "flow" which continue to see it as if it were always an integral part of it.
- **"fixed"**, for its part, will define the origin of the coordinates calculation in the upper left corner of our viewport (display window of our browser), very handy option for "sticky" elements.
- In our case, we use the value **"absolute"** which defines that the element sees the origin of its coordinates initialized to those of the parent element. If we had not defined the position of our container as "relative", it would have its default value set to "static" which would return the origin of its children coordinates to the previous element or parent and move up the chain and so on until it meet a so-called "reference" element where up to the last element of our page is the <body> element. Being defined in "relative", we indicate to our rendering engine that its children coordinates will be relative to the latter.

# A depth story

We want our layers to overlap their entire surface. To do so, we take care to assign it a depth index **"z-index"** superior to our previous layer so that it appears upon our previous layer. Remember that with equal depth index, it's the order of the elements in our html code that will define which element is on top of the other. Although it isn't necessary in our case to attribute a depth index, I usually define it when the latter has a primordial role in the consistency of my page rendering in order to avoid inconvenience caused by a crappy "copy-paste" or to a messy coding. It should be remembered that the depth index only affects the "positioned" elements.

# white - black = ?

Finally, we add the attribute **"mix-blend-mode"** with **difference** which will indicate that we wish to "subtract" the darkest color of our layers to the clearer color.

> To understand the operation, you must have some notions in hexadecimal. If you don't want to have a headache understand that the hexadecimal is a base 16 numeral syste : it has 16 symbols to code our values (0->1->2->3->4->5->6->7->8->9->A->B->C->D->E->F) when decimal system (base 10), the one you use every day, contains only 10 (0->1->2->3->4->5->6->7->8->9).

> Our colors are spread on 3 channels in their "<abbr title="Red Green Blue">RGB</abbr>" representation, Each channel having 256 shades or 16² which gives us by channels :
>
>- R => \[0, 255\] (base10) => \[00, FF\] (base16)
>- G => \[0, 255\] (base10) => \[00, FF\] (base16)
>- B => \[0, 255\] (base10) => \[00, FF\] (base16)
>
> Remember also that white is the result of adding all the colors of the spectrum when black is the presence of none.
>
> This allows us to understand the decimal representation (base10) of our colors : rgb(255, 255, 255) which represents the white color and its equivalent in hexadecimal (base16) #FFFFFF (The "#" being the flag in <abbr title="Cascading Style Sheets">CSS</abbr> that we supply a hexadecimal value.

It's necessary to understand by "difference" the subtraction of these values pixel by pixel. In our case, only 2 colors come into play: the **black** rgb(0, 0, 0) <=> #000000 and the **white** rgb(255, 255, 255) <=> #FFFFFF.

In the first 50% of our gauge, <abbr title="Cascading Style Sheets">CSS</abbr> subtracts the black from the layer ".fill" to the white of our text ".text" which give us :

<p class="notice--info" markdown="1">
(#FFFFFF - #000000) = #FFFFFF or to better understand what is happening (rgb(255, 255, 255) - rgb(0, 0, 0)) =  rgb(255-0, 255-0, 255-0) = rgb(255, 255, 255) = white either literally "*white* minus *black* equal *white*".
</p>

We applied the "mix-blend-mode" to our layer ".text" which has no background color but has a "color" attribute on which the effect will apply and our text will take the value of this subtraction ie "white".

Now, the remaining 50% of our gauge that reveals the background color of our container that is "white". The same operation is repeated:

<p class="notice--info" markdown="1">
(#FFFFFF - #FFFFFF) = #000000 or (rgb(255, 255, 255,) - rgb(255, 255, 255)) = rgb(255-255, 255-255, 255-255) = rgb(0, 0, 0) = black either literally "*white* minus *black* equal *black*".
</p>

We have a gauge with contrast text that reverses according to the background color as expected but, monochrome, even if it's "passe-partout", it isn't the top of what can be done...

# A little color

Let's move on to our last **merge layer**. The one that will define the effect zone :

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

As for the previous layer, we superimpose it on the two preceding elements on the totality of their surfaces and then we attribute to it a background color that we wish to see applied to our text AND our gauge.

To do so, we give our "blend-mode" function the value of **"screen"** (the inverse of multiply) which, this time, "multiplies" the inverse (or complementary) colors of the elements with those of the background and restores the inverse (or complementary) value. And ... tadaaaaaam !!! Here you have a gauge whose text will remain readable regardless of the filling rate of the latter.

# Conclusion

We have already seen a simple and "functional" example of mix-blend-mode which, although still imperfect in its support by the different browsers on the market, suggests the future of image processing capabilities, opening doors locked so far.

Our example is deliberately simplistic for a didactic purpose but it's quite possible to make layers of fusion much more complex especially with the help of the svg that I think to approach in a future post.

See you soon...
