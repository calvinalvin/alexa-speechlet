## Alexa Speechlet  
##### Speech Synthesis Markup generator that makes it easy to do all the things

------

To install:
`npm install alexa-speechlet --save`

example usage
```js
const Speechlet = require("alexa-speechlet");
let speech = new Speechlet("Hi my name is Alexa.");
let ssml = speech.sentence("I have a secret to tell you")
                  .whisper("I'm not a real human")
                  .output();
// ssml will look like this
// Hi my name is Alexa.I have a secret to tell you.<amazon:effect name="whispered">I'm not a real human</amazon:effect>

```

#### Methods

##### say(text)
- text {String} - What Alexa says

Adds text to the markup without adding any additional markup. It will spit out exactly what you enter as is.


##### sentence(text)
- text {String} - What Alexa says

A convenience method that makes sure that a period '.' is applied to the end of the text

```js
let speechlet = new Speechlet().sentence("Hi, my name is Alexa");
// outputs:
// Hi, my name is Alexa.
```

##### sayAs(text, options)
- text {String} - What Alexa says
- options {Object}
 - options.interpretAs adds 'interpret-as' attr to the markup. Such as <say-as interpret-as="spell-out">

Appends <say-as> markup to your text

```js
let ssml = new Speechlet("I can count.").pause().sayAs("12345", {interpretAs: "digits"}).output();`
// outputs:
// I can count.<say-as interpret-as="digits">12345</say-as>
```
