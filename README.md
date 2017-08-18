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
// Hi my name is Alexa.<s>I have a secret to tell you</s><amazon:effect name="whispered">I'm not a real human</amazon:effect>

// then emit with alexa-sdk
// this.emit(':tell', ssml);
```

##### Remember to call output()

You must execute the `output()` method on the speechlet instance in order to get the markup string. output() will not wrap the output in `<speak></speak>` nodes. If you are working with `alexa-sdk` the sdk will do that for you in the final output. If you, however, do want the output markup to be wrapped with the 'speak' nodes then you can use `outputWithRootNode()`,

### Methods

---
##### say(text)
- `text` | {String} - What Alexa says

Adds text to the markup without adding anything. It will spit out exactly what you enter as is. This is useful for generating complex nested markup that you cannot achieve through the other methods.

```js
let simpleSpeech = new Speechlet();
let simpleSSML = simpleSpeech.say("Hi. This is a simple sentence.").output();

// simpleSSML outputs
// Hi. This is a simple sentence.

let complexSpeech = new Speechlet();
let complexSSML = complexSpeech.say('<s>When <emphasis level="strong">I</emphasis> wake up, <prosody rate="x-slow">I speak quite slowly</prosody></s>').output();
// complexSSML outputs
// <s>When <emphasis level="strong">I</emphasis> wake up, <prosody rate="x-slow">I speak quite slowly</prosody></s>

```


---
##### sentence(text)
- `text` | {String} - What Alexa says

Wraps your text with `<s></s>` tags.

```js
let ssml = new Speechlet().sentence("Hi, my name is Alexa").output();
// outputs:
// <s>Hi, my name is Alexa</s>
```

---
##### sayAs(text, options)
- `text` | {String} - What Alexa says
- `options` | {Object}
  - `options.interpretAs` adds 'interpret-as' attr to the markup. Such as `<say-as interpret-as="spell-out">`

Wraps your text with `<say-as>` tags

```js
let ssml = new Speechlet("I can count.").pause().sayAs("12345", {interpretAs: "digits"}).output();
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
 - interjection (Useful for [speechcons](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference) Bazinga!)


Note: The convenience fn are named `sayAs` + the capitalized version of the interpretation with dashes removed. So the convenience fn for "spell-out" would be `sayAsSpellout(text)`


See [here](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as) for the Alexa documentation for say-as. If I am missing anything feel free to make a PR.

---

##### sayAsDate(text, format)
- `text` | {String} - What Alexa says
- `format` | {String} - The format of the date Alexa will read it as. For example "mdy". Read the  [Alexa docs](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as) for explanation

Convenience for `sayAs(text, {interpretAs: "date", format: "mdy"})`. sayAsDate accepts an extra "format" param.

```js
let ssml = new Speechlet().sayAsDate("September 22, 2015", "mdy").output();
// outputs:
// <say-as interpret-as="date" format="mdy">September 22, 2015</say-as>
```
---
##### amazonEffect(text, options)
- `text` | {String} - What Alexa says
- `options` | {Object}
  - `options.name` - The name of the effect. eg. "whispered"

Wraps text with `<amazon:effect>` tags. Applies Amazon-specific effects to the speech.

```js
let speech = new Speechlet();
let ssml = speech.amazonEffect("I'm going to whisper this.", { name: "whispered" }).output();

// outputs:
// <amazon:effect name="whispered">I'm going to whisper this.</amazon:effect>
```

---
##### whisper(text)
- `text` | {String} - What Alexa says

Convenience fn for `amazonEffect(text, { name: "whispered" })`. Applies a whisper to the markup.

```js
let speech = new Speechlet();
let ssml = speech.whisper("I'm going to whisper this.").output();

// outputs:
// <amazon:effect name="whispered">I'm going to whisper this.</amazon:effect>
```

---
##### prosody(text, options)
- `text` | {String} - What Alexa says
- `options` | {Object}
  - `options.rate` - Modify the rate of the speech. eg. "x-slow", "slow", "fast", "80%"
  - `options.pitch` - Raise or lower the tone (pitch) of the speech. eg "high", "x-high", "low", "-50%""
  - `options.volume` - Change the volume for the speech. eg. "silent", "high", "loud", "+4.08dB"

Modifies the volume, pitch, and rate of the tagged speech.

```js
let speech = new Speechlet();
let ssml = speech.say("I'm going to say this really loud. Are you ready?")
                 .pause('1s')
                 .prosody("AAHHH", { volume: "x-loud" });
                 .output();

// outputs:
// I'm going to say this really loud. Are you ready?<break time="1s" /><prosody volume="x-loud">AAHHH</prosody>
```

---
##### phoneme(text, options)
- `text` | {String} - What Alexa says
- `options` | {Object}
  - `options.alphabet` - Set to the phonetic alphabet to use eg. "ipa" or "x-sampa"
  - `options.ph` - The phonetic pronunciation to speak. eg. "pɪˈkɑːn" for the word "pecan"

Wraps text in `<phoneme>` tags. See docs on [phonemes and supported symbols here](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#phoneme). Phonemes provides a phonemic/phonetic pronunciation for the contained text. For example, people may pronounce words like “pecan” differently.

```js
let speech = new Speechlet();
let ssml = speech.say("You say, ")
                 .phoneme("pecan", { alphabet: "ipa", ph="pɪˈkɑːn" })
                 .say(".I say, ")
                 .phoneme("pecan", { alphabet: "ipa", ph="ˈpi.kæn" });
                 .output();

// outputs:
// You say, <phoneme alphabet="ipa" ph="pɪˈkɑːn">pecan</phoneme>.I say, <phoneme alphabet="ipa" ph="ˈpi.kæn">pecan</phoneme>.
```
---
##### break(options)
- `options` | {Object}
  - `options.strength` - "none", "x-weak", "weak", "medium", "strong", "x-strong"
  - `options.time` - Duration of the pause; up to 10 seconds (10s) or 10000 milliseconds (10000ms). Include the unit with the time (s or ms).
Represents a pause in the speech. Set the length of the pause with the strength or time attributes.

```js
let speech = new Speechlet();
let ssml = speech.say("Let's see here")
  .break({ strength: "x-strong" })
  .say("Oh here it is")
  .output();

// outputs:
// Let's see here<break strength="x-strong">Oh here it is
```

---

##### emphasis(text, options)
- `text` | {String} - What Alexa says
- `options` | {Object}
  `options.level` - "strong", "moderate", "reduced"

Wraps the text with `<emphasis>` tags. Emphasize the tagged words or phrases. Emphasis changes rate and volume of the speech. More emphasis is spoken louder and slower. Less emphasis is quieter and faster. See [docs](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#emphasis)

```js
let speech = new Speechlet();
let ssml = speech.say("I already told you I")
                 .emphasis("really like", { level: "strong" })
                 .say("that person")
                 .output();

// outputs:
// I already told you I<emphasis level="strong">really like</emphasis>that person
```

---

##### pause(time="0.8s")
- `time` | {String} - The time value you want to pause. Defaults to "0.8s"

Convenience method for break. Adds `<break>` markup to your text with a time value. If you want more flexibility, use the `break()` fn. Represents a pause in the speech. Set the length of the pause with the time attribute.

```js
let speech = new Speechlet();
let ssml = speech.say("Hmm let me think for a sec")
                 .pause("3s")
                 .say("Ok I think I figured it out")
                 .output();

// outputs:
// Hmm let me think for a sec<break time="3s">Ok I think I figured it out
```
