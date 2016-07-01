# PlaySketch: a collaborative sketcing tool

PlaySketch is an informal web-based sketching tool that targets video game designers. Featureing real-time collaboration, it allows teams of users to collaborate on the same sketch, or a single user to work across multiple devices.

The web-based app is the result of an individual research project I undertook in the Singapore Management University, and supervised by Dr. Richard C. Davis. This page summarises my findings and functionalities of the PlaySketch prototype implemented to demonstrate the application of Operational Transformation as the underlying real-time technology in collaborative sketching on HTML5 Canvas.

## Operational Transformation

Pioneered by Ellis and Gibbs in 1989, Operational Transformation (OT) is currently the most extensively used concurrency control technology used in modern web-based collaborative tools (e.g. Google Docs, Trello). Early implementations of OT algorithms focused on solving concurrency and consistency issues in text editing groupware systems, with an example of one such issue diagrammed below:

![text concurrency issue](/images/fig1.png)

The concurrency issue here occurs when the *operation* “Del 6” is propagated from Person 1 to Person 2's text editor. Because Person 2 has already removed the third character from the string in *operation* “Del 3”, “Del 6” cannot be achieved as there are now only five characters left. OT algorithms introduce the concept of *transforming* any concurrent incoming *operation* from other sites against the *operation* that has been executed locally.

![resolved text concurrency](/images/fig2.png)
