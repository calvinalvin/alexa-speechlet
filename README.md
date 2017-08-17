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
// output:
// Hi my name is Alexa.I have a secret to tell you.<amazon:effect name="whispered">I'm not a real human</amazon:effect>

```

##### Remember to call output()

You must execute the `output()` method on the speechlet instance in order to get the markup string. output() will not wrap the output in `<speak></speak>` xml nodes. If you are working with `alexa-sdk` the sdk will do that for you in the final output so the nodes were left out by default so it would be more convenient. If you, however, do want the output markup to be wrapped with the 'speak' nodes then you can call `outputWithRootNode()`,

#### Methods

---
##### say(text)
- `text` | {String} - What Alexa says

Adds text to the markup without adding any additional markup. It will spit out exactly what you enter as is.


---
##### sentence(text)
- `text` | {String} - What Alexa says

A convenience method that makes sure that a period '.' is applied to the end of the text

```js
let speechlet = new Speechlet().sentence("Hi, my name is Alexa");
// outputs:
// Hi, my name is Alexa.
```

---
##### sayAs(text, options)
- `text` | {String} - What Alexa says
- `options` | {Object}
  - `options.interpretAs` adds 'interpret-as' attr to the markup. Such as `<say-as interpret-as="spell-out">`

Appends <say-as> markup to your text

```js
let ssml = new Speechlet("I can count.").pause().sayAs("12345", {interpretAs: "digits"}).output();`
// outputs:
// I can count.<break strength="strong" /><say-as interpret-as="digits">12345</say-as>
```

We also expose convenience methods for the sayAs method for each interpretation. For instance instead of calling `speechlet.sayAs("12345", {interpretAs: "digits"});` you can do `speechlet.sayAsDigits("12345");`.

We do this for the following interpretations:
 - characters
 - spell-out
 - cardinal
 - ordinal
 - digits
 - fraction
 - unit
 - date
 - time
 - telephone
 - address
 - interjection


Note: The convenience fn are named `sayAs` + the capitalized version of the interpretation with dashes removed. So the convenience fn for "spell-out" would be `sayAsSpellout(text)`


See [here](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as) for the Alexa documentation for say-as. If I am missing anything feel free to make a PR.

---

##### sayAsDate(text, format)
- `text` | {String} - What Alexa says
- `format` | {String} - The format of the date Alexa will read it as. For example "mdy". Read the  [Alexa docs](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as) for explanation

Convenience for `sayAs(text, {interpretAs: "date", format: "mdy"})`. sayAsDate accepts an extra "format" param.

```js
let ssml = new Speechlet().sayAsDate("September 22, 2015", "mdy").output();`
// outputs:
// <say-as interpret-as="date" format="mdy">September 22, 2015</say-as>
```

---

##### pause(time)
- `time` | {String} - The time value you want to pause
- `options` | {Object}
  - `options.interpretAs` adds 'interpret-as' attr to the markup. Such as `<say-as interpret-as="spell-out">`

Appends <say-as> markup to your text
