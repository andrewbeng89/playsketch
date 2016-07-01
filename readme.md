# PlaySketch: a collaborative sketching tool

PlaySketch is an informal web-based sketching tool that targets video game designers. Featureing real-time collaboration, it allows teams of users to collaborate on the same sketch, or a single user to work across multiple devices.

This web-based app is the result of an individual research project I undertook in the Singapore Management University, and supervised by Dr. Richard C. Davis. This page summarises my findings and functionalities of the PlaySketch prototype implemented to demonstrate the application of Operational Transformation as the underlying real-time technology in collaborative sketching on HTML5 Canvas.

The full research paper on this project is available [here](PlaySketch_OT_research.pdf).

## Operational Transformation

Pioneered by Ellis and Gibbs in 1989, Operational Transformation (OT) is currently the most extensively used concurrency control technology used in modern web-based collaborative tools (e.g. Google Docs, Trello). Early implementations of OT algorithms focused on solving concurrency and consistency issues in text editing groupware systems, with an example of one such issue diagrammed below:

![text concurrency issue](public/images/fig1.png)

The concurrency issue here occurs when the *operation* “Del 6” is propagated from Person 1 to Person 2's text editor. Because Person 2 has already removed the third character from the string in *operation* “Del 3”, “Del 6” cannot be achieved as there are now only five characters left. OT algorithms introduce the concept of *transforming* any concurrent incoming *operation* from other sites against the *operation* that has been executed locally.

![resolved text concurrency](public/images/fig2.png)

OT can be implemented in client-server protocols that support collaboration between any number of clients. The state space diagram below shows all possible traversals of client and server operations. The document state is represented by a tuple of numbered client (left integer) and server (right integer) operations.

![resolved text concurrency](public/images/fig6.png)

## Prototyping with Node.js, ShareJS and Fabric.js

My research highlighted the [ShareJS](https://github.com/share/ShareJS "ShareJS GitHub Page") OT library implemented in Node.js as a promising toolkit to test OT in HTML5 web apps due to the library's support [*operations* on arbitrary JSON documents](https://github.com/ottypes/json0 "JSON OT Type"). Combined with [Fabric.js](http://fabricjs.com "Fabric.js Home Page"), a HTML5 Canvas JavaScript library using JSON documents to represent sketches and shapes, following client-server architecture was used to develop the PlaySketch prototype:

![PlaySketch architecture](public/images/fig12.png)

Try the PlaySketch prototype [here](http://playsketch.andrewbeng89.me "PlaySketch"). The app is compatible on Chrome or Firefox browsers, as well as mobile browsers. The default mode in PlaySketch is "drawing mode", with strokes captured on the sketchpad by mouse or touch (on mobile devices). Sketch and shape manipulations (e.g. object/group selections, move, scale, skey) are enabled by cancelling "drawing mode". *Operations* resulting from manipulations are captured by comparing previous and current object states, before being propagated and *transformed*. Users can collaborate on sketches by sharing the URL including the hash ID from address bar.

![PlaySketch prototype](public/images/fig13.png)

## Clone and run PlaySketch

1. `git clone https://github.com/andrewbeng89/playsketch.git`
2. `npm install`
3. Run with `node app`
3. Open Chrome or Firefox to http://localhost:3000
