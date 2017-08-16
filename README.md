## Alexa Speechlet  
##### Speech Synthesis Markup generator that makes it easy to do all the things

------

To install:
`npm install alexa-speechlet --save`

example usage
```
const Speechlet = require("alexa-speechlet");

const speech = new Speechlet();
const ssml = speech.sentence("Hi my name is Alexa.")
                  .sentence("I have a secret to tell you")
                  .whisper("I'm not a real human")
                  .output();


```
