const _ = require('lodash');
const ordinal = require('./ordinal');

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

  _escape(text) {
    return text.replace(/&/g, ' and ')
      .replace(/</g, ' less than ')
      .replace(/>/g, ' greater than ');
  }

  /*
  * Helps Alexa easily read a list as a numbered list
  * @params {array[string]} list - a list of things for Alexa to read
  * @param {object} options
  *   options.pause - control the pause time between items
  */
  readAsNumberedList(list, options={}) {
    if (!Array.isArray(list)) {
      throw new Error("readAsNumberedList [arg list must be an array]");
    }

    list.forEach((el, i) => {
      this.say(`${i+1}, ${this._escape(el)}`);
      if (options.pause) {
        this.pause(options.pause);
      } else {
        this.pause("0.2s");
      }
    });

    return this;
  }

  /*
  * Helps Alexa easily read a list as ordinal items
  * @params {array[string]} list - a list of things for Alexa to read
  * @param {object} options
  *   options.pause - control the pause time between items
  */
  readAsOrdinalList(list, options={}) {
    if (!Array.isArray(list)) {
      throw new Error("readAsOrdinalList [arg list must be an array]");
    }

    list.forEach((el, i) => {
      this.say(`${ordinal.translate(i+1)}, ${this._escape(el)}`);
      if (options.pause) {
        this.pause(options.pause);
      } else {
        this.pause("0.2s");
      }
    });

    return this;
  }

  /*
  * Helps Alexa easily read a list of items with easy customization
  * @params {array[string]} list - a list of things for Alexa to read
  * @params {string} separator - a string word to seperate the reading of the list, defaults to "and"
  * @param {object} options
  *   options.lastSeparator - a string value to use for the last seperator. For instance when reading a list, naturally you read the last item with a different conjunction. For instance. "These are your books. Book 1, Book 2 and Book 3" Notice that you say "and Book 3" for the last item.
  *   options.pauseBeforeSeparator - injects a pause before the seperator
  *   options.pauseAfterSeparator - injects a pause after the seperator
  */
  readAsList(list, options={}) {
    if (!Array.isArray(list)) {
      throw new Error("readAsOrdinalList [arg list must be an array]");
    }

    const separator = options.separator || "and";
    list.forEach((el, i) => {
      if (i !== list.length-1) {
        this.say(`${this._escape(el)} `);
        if (options.pauseBeforeSeparator) {
          this.pause(options.pauseBeforeSeparator);
        }

        this.say(`${this._escape(separator)} `);

        if (options.pauseAfterSeparator) {
          this.pause(options.pauseAfterSeparator);
        }
      } else if (options.lastSeparator && list.length > 1) {
        this.say(`${options.lastSeparator} ${this._escape(el)}`);
      } else {
        this.say(this._escape(el));
      }
    });

    return this;
  }

  /**
  * The audio tag lets you provide the URL for an MP3 file that the Alexa service can play
  * while rendering a response. You can use this to embed short, pre-recorded audio within your service’s response.
  * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#audio
  */
  audio(src="") {
    this._markup.push(`<audio src="${src}" />`);
    return this;
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
    this._markup.push(`${openTag}>${this._escape(text)}${closeTag}`);
    return this;
  }

  /**
  * Adds raw text without any changes.
  */
  raw(text) {
    this._markup.push(text);
    return this;
  }

  /**
  * Adds raw text without any changes.
  */
  say(text) {
    return this.raw(text);
  }

  /**
  * Wraps text in <s> tags. This is equivalent to ending a sentence with a period (.)
  * or specifying a pause with <break strength="strong"/>.
  * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#s
  */
  sentence(text) {
    this._markup.push(`<s>${this._escape(text)}</s>`);
    return this;
  }

  /**
  * Represents a paragraph. This tag provides extra-strong breaks before and after the tag.
  * This is equivalent to specifying a pause with <break strength="x-strong"/>.
  * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#p
  */
  paragraph(text) {
    this._markup.push(`<p>${this._escape(text)}</p>`);
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

    this._markup.push(`${openTag}>${this._escape(text)}${closeTag}`);
    return this;
  }

  /**
  * Pronounce the specified word or phrase as a different word or phrase.
  * Specify the pronunciation to substitute with the alias attribute.
  * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#sub
  */
  sub(text, options={}) {
    let openTag = '<sub';
    let closeTag = '</sub>';
    if (options.alias) {
      openTag += ` alias="${options.alias}"`;
    }
    this._markup.push(`${openTag}>${this._escape(text)}${closeTag}`);
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
    this._markup.push(`${openTag}>${this._escape(text)}${closeTag}`);
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
    this._markup.push(`${openTag}>${this._escape(text)}${closeTag}`);
    return this;
  }

  paragraph(text) {
    this._markup.push(`<p>${this._escape(text)}</p>`);
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
    this._markup.push(`${openTag}>${this._escape(text)}${closeTag}`);
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
    this._markup.push(`${openTag}>${this._escape(text)}${closeTag}`);
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
