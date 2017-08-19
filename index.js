const _ = require('lodash');

class Speechlet {
  constructor(text) {
    this._markup = [];
    if (text) {
      this._markup.push(text);
    }
    this._exposeSayAsConvenienceMethods();
  }

  _exposeSayAsConvenienceMethods() {
    let interpretAs = ['characters', 'spell-out', 'cardinal', 'ordinal', 'digits',
      'fraction', 'unit', 'time', 'telephone', 'address', 'interjection'
    ];
    interpretAs.forEach((as) => {
      this[`sayAs${_.capitalize(_.camelCase(as))}`] = function(text) {
        return this.sayAs(text, { interpretAs: as });
      }
    });
  }

  /**
  * Emphasize the tagged words or phrases. Emphasis changes rate and volume of the speech.
  * More emphasis is spoken louder and slower. Less emphasis is quieter and faster.
  * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#emphasis
  */
  emphasis(text, options) {
    let openTag = `<emphasis`;
    let closeTag = '</emphasis>';
    if (options.level) {
      openTag += ` level="${options.level}"`;
    }
    this._markup.push(`${openTag}>${text}${closeTag}`);
    return this;
  }

  /**
  * Adds raw text without any changes.
  */
  say(text) {
    this._markup.push(text);
    return this;
  }

  /**
  * Wraps text in <s> tags. This is equivalent to ending a sentence with a period (.)
  * or specifying a pause with <break strength="strong"/>.
  * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#s
  */
  sentence(text) {
    this._markup.push(`<s>${text}</s>`);
    return this;
  }

  /**
  * Represents a paragraph. This tag provides extra-strong breaks before and after the tag.
  * This is equivalent to specifying a pause with <break strength="x-strong"/>.
  * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#p
  */
  paragraph(text) {
    this._markup.push(`<p>${text}</p>`);
    return this;
  }

  /**
  * Provides a phonemic/phonetic pronunciation for the contained text.
  * For example, people may pronounce words like “pecan” differently.
  * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#phoneme
  */
  phoneme(text, options={}) {
    let openTag = '<phoneme';
    let closeTag = '</phoneme>';
    if (options.alphabet) {
      openTag += ` alphabet="${options.alphabet}"`;
    }
    if (options.ph) {
      openTag += ` ph="${options.ph}"`;
    }

    this._markup.push(`${openTag}>${text}${closeTag}`);
    return this;
  }

  /**
  * Describes how the text should be interpreted.
  * This lets you provide additional context to the text and eliminate any ambiguity
  * on how Alexa should render the text. Indicate how Alexa should interpret the text
  * with the interpret-as attribute. https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as
  */
  sayAs(text, options={}) {
    let openTag = '<say-as';
    let closeTag = '</say-as>'
    if (options.interpretAs) {
      openTag += ` interpret-as="${options.interpretAs}"`;
    }
    if (options.format) {
      openTag += ` format="${options.format}"`;
    }
    this._markup.push(`${openTag}>${text}${closeTag}`);
    return this;
  }

  /**
  * special convenience method for sayAs because date also accepts a `format` argument
  */
  sayAsDate(text, format) {
    return this.sayAs(text, { interpretAs: "date", format: format });
  }

  /**
  * special convenience method for sayAs because date also accepts a `format` argument
  */
  sayAsVerb(text) {
    return this.w(text, { role: "amazon:VB" });
  }

  /**
  * special convenience method for sayAs because date also accepts a `format` argument
  */
  sayAsNoun(text) {
    return this.w(text, { role: "amazon:NN" });
  }

  /**
  * special convenience method for sayAs because date also accepts a `format` argument
  */
  sayAsPastParticiple(text) {
    return this.w(text, { role: "amazon:VBD" });
  }

  /**
  * Similar to <say-as>, this tag customizes the pronunciation of words by specifying the word’s part of speech.
  * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#w
  */
  w(text, options={}) {
    let openTag = '<w';
    let closeTag = '</w>';
    if (options.role) {
      openTag += ` role="${options.role}"`;
    }
    this._markup.push(`${openTag}>${text}${closeTag}`);
    return this;
  }

  paragraph(text) {
    this._markup.push(`<p>${text}</p>`);
    return this;
  }

  /**
  * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#prosody
  */
  prosody(text, options={}) {
    let openTag = '<prosody';
    let closeTag = '</prosody>';
    if (options.rate) {
      openTag += ` rate="${options.rate}"`;
    }
    if (options.pitch) {
      openTag += ` pitch="${options.pitch}"`;
    }
    if (options.volume) {
      openTag += ` volume="${options.volume}"`;
    }
    this._markup.push(`${openTag}>${text}${closeTag}`);
    return this;
  }

  /**
  * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#amazon-effect
  *
  */
  amazonEffect(text, options={}) {
    let openTag = "<amazon:effect";
    let closeTag = "</amazon:effect>";
    if (options.name) {
      openTag += ` name="${options.name}"`;
    }
    this._markup.push(`${openTag}>${text}${closeTag}`);
    return this;
  }

  /**
  * Convenience method for doing amazon:effect name="whisper"
  */
  whisper(text) {
    return this.amazonEffect(text, { name: "whispered" });
  }

  /**
  * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#break
  * defaults to <break strength="strong">
  */
  break(options={}) {
    let openTag = `<break`;
    if (options.time) {
      openTag += ` time="${options.time}"`;
    } else if (options.stength) {
      openTag += ` strength="${options.strength}"`;
    } else {
      openTag += ` strength="strong"`;
    }
    this._markup.push(`${openTag} />`);
    return this;
  }

  /**
  * convenience method for calling "break". This one only accepts a time param. If you need to use a break, with the "strength" attr, then use break();
  */
  pause(time="0.8s") {
    return this.break({ time: time });
  }

  /**
  * outputs the speech markup as a string. This does not include the root <speak></speak> node in the output`
  * if you are working with the official `alexa-sdk` then the `emit()` fn will wrap the ssml with the <speak> node for you
  * if you need the <speak> nodes then use the `outputWithRootNode()` fn
  */
  output() {
    return `${this._markup.join('')}`;
  }

  /**
  * outputs the markup as a string just like the `output()` fn, except this includes wraps with the root <speak></speak> nodes
  */
  outputWithRootNode() {
    return `<speak>${this._markup.join('')}</speak>`;
  }
}

module.exports = Speechlet;
