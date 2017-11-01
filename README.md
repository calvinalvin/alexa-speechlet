## Alexa Speechlet  
##### Speech Synthesis Markup generator that makes it easy to do all the things

------

To install:
`npm install alexa-speechlet --save`

example usage
```js
const Speechlet = require("alexa-speechlet");

let speech = new Speechlet();
let todoList = ['buy shampoo', 'book flight to Seattle', 'make dinner reservations'];
let ssml = speech.sentence("This is your todo list")
                 .readAsOrdinalList(todoList, { pause: "0.4s" })
                 .output();

// outputs:
// <s>This is your todo list</s>first, buy shampoo<break time="0.4s" />second, book flight to Seattle<break time="0.4s" />third, make dinner reservations

// then emit with alexa-sdk
// this.emit(':tell', ssml);
```

##### Remember to call output()

You must execute the `output()` method on the speechlet instance in order to get the markup string. output() will not wrap the output in `<speak></speak>` nodes. If you are working with `alexa-sdk` the sdk will do that for you in the final output. If you, however, do want the output markup to be wrapped with the 'speak' nodes then you can use `outputWithRootNode()`,

##### Automatic special character escaping

Speechlet will automatically escape the special characters `&`, `<` and `>` for you. (Except in the `say()` method, which will not modify any inputs since it allows raw xml inputs)

### Methods

---
#### say(text)
- `text` | {String} - What Alexa says

Adds text to the markup without modifying or adding anything. It will spit out exactly what you enter as is. This is useful for generating complex nested markup that you cannot achieve through the other methods.

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
#### raw(text)
- `text` | {String} - What Alexa says

For convenience and code readability. Exactly the same as `say()`

---
#### sentence(text)
- `text` | {String} - What Alexa says

Wraps your text with `<s></s>` tags.

```js
let ssml = new Speechlet().sentence("Hi, my name is Alexa").output();
// outputs:
// <s>Hi, my name is Alexa</s>
```

---
#### sayAs(text, options)
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

#### sayAsDate(text, format)
- `text` | {String} - What Alexa says
- `format` | {String} - The format of the date Alexa will read it as. For example "mdy". Read the  [Alexa docs](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as) for explanation

Convenience for `sayAs(text, {interpretAs: "date", format: "mdy"})`. sayAsDate accepts an extra "format" param.

```js
let ssml = new Speechlet().sayAsDate("September 22, 2015", "mdy").output();
// outputs:
// <say-as interpret-as="date" format="mdy">September 22, 2015</say-as>
```
---

#### sayAsVerb(text)
- `text` | {String} - What Alexa says

Convenience for `w(text, {role:"amazon:VB"})`. Pronounces the word as a verb.

```js
let ssml = new Speechlet().sayAsVerb("read").output();
// outputs:
// <w role="amazon:VB">read</w>
```
---

#### sayAsNoun(text)
- `text` | {String} - What Alexa says

Convenience for `w(text, {role:"amazon:NN"})`. Pronounces the word as a noun.

```js
let ssml = new Speechlet().sayAsVerb("read").output();
// outputs:
// <w role="amazon:NN">read</w>
```

---

#### sayAsPastParticiple(text)
- `text` | {String} - What Alexa says

Convenience for `w(text, {role:"amazon:VBD"})`. Pronounces the word in past tense.

```js
let ssml = new Speechlet().sayAsVerb("read").output();
// outputs:
// <w role="amazon:VBD">read</w>
```

---
#### amazonEffect(text, options)
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
#### whisper(text)
- `text` | {String} - What Alexa says

Convenience fn for `amazonEffect(text, { name: "whispered" })`. Applies a whisper to the markup.

```js
let speech = new Speechlet();
let ssml = speech.whisper("I'm going to whisper this.").output();

// outputs:
// <amazon:effect name="whispered">I'm going to whisper this.</amazon:effect>
```

---
#### prosody(text, options)
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
#### phoneme(text, options)
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
#### break(options)
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

#### emphasis(text, options)
- `text` | {String} - What Alexa says
- `options` | {Object}
  - `options.level` - "strong", "moderate", "reduced"

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

#### pause(time="0.8s")
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

---

#### audio(src)
- `src` | {String} - The source url of the audio file

The audio tag lets you provide the URL for an MP3 file that the Alexa service can play while rendering a response. You can use this to embed short, pre-recorded audio within your service’s response. For example, you could include sound effects alongside your text-to-speech responses, or provide responses using a voice associated with your brand. For more information, see Including Short Pre-Recorded Audio in your Response.

```js
let speech = new Speechlet();
let ssml = speech.audio("http://example.com/audio_file.mp3")
                 .output();

// outputs:
// <audio src="http://example.com/audio_file.mp3" />
```

---

#### sub(text, options)
- `text` | {String} - What Alexa says
- `options` | {Object}
  - `options.alias` - The url of the audio file

The word or phrase to speak in place of the tagged text.


```js
let speech = new Speechlet();
let ssml = speech.say("My favorite chemical element is ")
                 .sub("Al", { alias: "aluminum" })
                 .output();

// outputs:
// My favorite chemical element is <sub alias="aluminum">Al</sub>
```

---

#### readAsList(list, options={})
- `list` | {Array<String>} - Array of string items
- `options` | {Object}
  - `options.separator` {String} - separator between list items, default is "and"
  - `options.lastSeparator` {String} - a string value to use for the last separator. For instance when reading a list, naturally you read the last item with a different conjunction. For instance. "These are your books. Book 1, Book 2 and Book 3" Notice that you say "and Book 3" for the last item.
  - `options.pauseBeforeSeparator` {String} - adds a pause before separator, eg "2s"
  - `options.pauseAfterSeparator` {String} - adds a pause after separator

Pass an array of strings that will be read as a list. The options allow for flexibility in controlling the dictation speed.

```js
let speech = new Speechlet();
let list = ['dogs', 'cats', 'lions'];
let ssml = speech.sentence("I own lots of different types of animals.")
                 .readAsList(list, { separator: "I have", pauseBeforeSeperator: "0.2s", lastSeparator: 'and also' })
                 .output();

// outputs:
// <s>I own lots of different types of animals.</s>I have dogs <break time="0.2s" />I have cats <break time="0.2s" />and also lions
```

---

#### readAsNumberedList(list, options={})
- `list` | {Array<String>} - Array of string items
- `options` | {Object}
  - `options.pause` - adds a pause before seperator, default "0.2s"

Pass an array of strings that will be read as a numbered list.


```js
let speech = new Speechlet();
let todoList = ['buy shampoo', 'book flight to Seattle', 'make dinner reservations'];
let ssml = speech.sentence("This is your todo list")
                 .readAsNumberedList(todoList, { pause: "0.4s" })
                 .output();

// outputs:
// <s>This is your todo list</s>1, buy shampoo<break time="0.4s" />2, book flight to Seattle<break time="0.4s" />3, make dinner reservations
```

---

#### readAsOrdinalList(list, options={})
- `list` | {Array<String>} - Array of string items
- `options` | {Object}
  - `options.pause` - adds a pause before seperator, default "0.2s"

Pass an array of strings that will be read as an ordinal list. The numbered items are read in ordinal form (first, second, third etc...)


```js
let speech = new Speechlet();
let todoList = ['buy shampoo', 'book flight to Seattle', 'make dinner reservations'];
let ssml = speech.sentence("This is your todo list")
                 .readAsOrdinalList(todoList, { pause: "0.4s" })
                 .output();

// outputs:
// <s>This is your todo list</s>first, buy shampoo<break time="0.4s" />second, book flight to Seattle<break time="0.4s" />third, make dinner reservations
```
