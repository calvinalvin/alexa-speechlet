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

  say(text) {
    this._markup.push(text);
    return this;
  }

  sentence(text) {
    this._markup.push(`<s>${text}</s>`);
    return this;
  }

  paragraph(text) {
    this._markup.push(`<p>${text}</p>`);
    return this;
  }

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
  }

  /**
  * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as
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
    this.amazonEffect(text, { name: "whispered" });
    return this;
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
  pause(time) {
    this.break({ time: time });
    return this;
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
