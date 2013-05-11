ArgunetPresentation
===================

a presentation framework for presenting argument reconstructions and argument maps. 

A Demo can be found here: http://christianvoigt.github.io/ArgunetPresentation/

Visit http://www.argunet.org for more information about argument mapping software and argument reconstruction.

Argunet Browser is released under the MIT license. http://en.wikipedia.org/wiki/MIT_License


1. How to create a presentation
-------------------------------

Just start from index.html and delete everything within 

    <div id='presentation'></div>. 
    
Then start by adding 

    <section></section>
    
elements.

ArgunetPresentation uses section elements as slides. You can use h1, h2 and h3 to give your section titles. You can define the first slide as a title slide if you add the class "title" to it.

Within each section, you can animate your presentation. Each slide can contain their own animation timeline. a slide's animation timeline consists of a series of steps. At each steps you can animate as many elements as you like and you can animate them in different ways. You insert an animation step by adding adding "data-step='stepNr'" to one or several elements. All you have left to do is to give these elements one of the following css classes to define how you want them to change at this step in the animation timeline:


 
###Add an element


    <element class="add" data-step="stepNr"> </element>

Add an Element to the slide at stepNr. These elements will be hidden at the beginning and displayed when their step comes.

###Remove an element

    <element class="remove" data-step="stepNr"> </element>
Removes an Element from the slide at stepNr. These elements will be shown at the beginning and hidden when their step comes.

###Substitute an element

    <element class="substitute" data-step="stepNr" data-target="id"> </element>

Substitutes this Element for the Element with the id at stepNr. This is especially useful for rephrasing and adapting premises step by step.

###Highlight an element

    <element class="highlight" data-step="stepNr"> </element>
 
Highlight this Element at stepNr. The background of these elements will turn yellow when their step comes.

###Adding comments

    <element class="comment" data-step="stepNr"></element>

Adds a comment at stepNr. Comments are displayed beside the slide. This is useful for displaying an argument reconstruction side by side with its evaluation or by explaining specific steps in the reconstruction process.

By default, only one comment at a time will be displayed. But you can use all other animation step types within a comment. That makes it possible to expand a comment with .add elements step by step (or substituting parts of it).

###Adding arguments, theses and quotes to your presentation

```

<ol class="argument">
<li>This is a premise</li>
<li class="conclusion">This is a conclusion</li>
<li class="assumption">This is an assumption</li>
<li class="conclusion"><span class="inference">Inference Rule, Sentences used: 2&3</span>This is a conclusion with an inference rule.</li>
</ol>

<div class='thesis'><h4>Title</h4>This is a claim.</div>

<blockquote><p>This is a source text.</p><p class="source">Christian Voigt, Readme for Argunet Presentation, 2013</p></blockquote>


```

As with every kind of element, you can add the animation step types described above to every part of an argument. So you could start out with just one premise and one conclusion and fill in the other premises and conclusions step by step. You can even change some text within a premise by using:

    <li> A premise: <span id='first-version'>All truths</span> are subjective. <span class="substitute" data-step='1' data-target='first-version'>Some truths</span></li>



##2. How to create a print version of your presentation

Argunet Presentation has a print mode that allows you to print out your presentation or to create a PDF file of it. By default Argunet Presentation's print mode does not display animation steps as single slides to keep the page number small. But you can manually customize the print display by adding special css classes for print to your elements. This makes the print mode very flexible and makes it easy to transform your presentation into a concise and nice-looking handout.

###Print step element as extra slide

    <element class="print" data-step="stepNr"> </element>

Inserts an extra slide for this step.

###Remove element from print mode

    <element class="no-print"> </element>
    
Removes this element from the print version.

###Show element in print mode only

    <element class="print-only"> </element>

Displays this element only in the print mode and removes it from the browser mode. </dd>

###Transform .substitute element into .add element in print mode
    <element class="substitute print-as-add"> </element> ```</dt> 

This will change the step type to .add in print mode. This is useful because otherwise .substitute steps will prevent the steps they are substituting from being displayed at all if the .substitute step has no .print class (so that it is added as an extra slide).

###Manual page breaks

Use "style='page-break-after:always;'" and "style='page-break-before:always;'" to insert manual page breaks in your document.