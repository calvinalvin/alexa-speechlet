class Speechlet {
  constructor(text) {
    this._markup = [];
    if (text) {
      this._markup.push(text);
    }
  }

  say(text) {
    this._markup.push(text);
    return this;
  }

  sentence(text) {
    if (text[text.length] !== '.') {
      text += '.';
    }
    this.say(text);
    return this;
  }

  sayAs(text, options) {
    let openTag = '<say-as';
    let closeTag = '</say-as>'
    if (options.interpretAs) {
      openTag += ` interpret-as="'${options.interpretAs}"`;
    }

    this._markup.push(`${openTag}>${text}${closeTag}`);
    return this;
  }

  interpretAs(text, interpretation) {
    this.sayAs(text, { interpretAs: interpretation });
    return this;
  }

  paragraph(text) {
    this._markup.push(`<p>${text}</p>`);
    return this;
  }

  /**
  * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#amazon-effect
  *
  */
  amazonEffect(text, options) {
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
    this.amazonEffect(text, { name: "whisper" });
    return this;
  }

  /**
  * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#break
  * defaults to <break strength="strong">
  */
  break(options) {
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



  output() {
    return `<speak>${this._markup.join('')}</speak>`;
  }
}

module.exports = Speechlet;
