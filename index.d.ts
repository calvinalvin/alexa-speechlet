export declare class Speechlet {
  _markup: any[];
  constructor(text?: string);
  _exposeSayAsConvenienceMethods(): void;
  _escape(text: string): string;
  readAsNumberedList(list: any, options?: readAsNumberedListOptions): this;
  readAsOrdinalList(list: any, options?: readAsOrdinalListOptions): this;
  readAsList(list: any, options?: readAsListOptions): this;
  /**
   * The audio tag lets you provide the URL for an MP3 file that the Alexa service can play
   * while rendering a response. You can use this to embed short, pre-recorded audio within your service’s response.
   * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#audio
   */
  audio(src?: string): this;
  /**
   * Emphasize the tagged words or phrases. Emphasis changes rate and volume of the speech.
   * More emphasis is spoken louder and slower. Less emphasis is quieter and faster.
   * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#emphasis
   */
  emphasis(text: string, options: emphasisOptions): this;
  /**
   * Adds raw text without any changes.
   */
  raw(text: string): this;
  /**
   * Adds raw text without any changes.
   */
  say(text: string): this;
  /**
   * Wraps text in <s> tags. This is equivalent to ending a sentence with a period (.)
   * or specifying a pause with <break strength="strong"/>.
   * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#s
   */
  sentence(text: string): this;
  /**
   * Represents a paragraph. This tag provides extra-strong breaks before and after the tag.
   * This is equivalent to specifying a pause with <break strength="x-strong"/>.
   * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#p
   */
  paragraph(text: string): this;
  /**
   * Provides a phonemic/phonetic pronunciation for the contained text.
   * For example, people may pronounce words like “pecan” differently.
   * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#phoneme
   */
  phoneme(text: string, options?: phonemeOptions): this;
  /**
   * Pronounce the specified word or phrase as a different word or phrase.
   * Specify the pronunciation to substitute with the alias attribute.
   * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#sub
   */
  sub(text: string, options?: subOptions): this;
  /**
   * Describes how the text should be interpreted.
   * This lets you provide additional context to the text and eliminate any ambiguity
   * on how Alexa should render the text. Indicate how Alexa should interpret the text
   * with the interpret-as attribute. https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#say-as
   */
  sayAs(text: string, options?: sayAsOptions): this;
  /**
   * special convenience method for sayAs because date also accepts a `format` argument
   */
  sayAsDate(text: any, format: any): this;
  /**
   * special convenience method for sayAs because date also accepts a `format` argument
   */
  sayAsVerb(text: string): this;
  /**
   * special convenience method for sayAs because date also accepts a `format` argument
   */
  sayAsNoun(text: string): this;
  /**
   * special convenience method for sayAs because date also accepts a `format` argument
   */
  sayAsPastParticiple(text: string): this;
  /**
   * Similar to <say-as>, this tag customizes the pronunciation of words by specifying the word’s part of speech.
   * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#w
   */
  w(text: string, options?: wOptions): this;
  /**
   * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#prosody
   */
  prosody(text: string, options?: prosodyOptions): this;
  /**
   * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#amazon-effect
   *
   */
  amazonEffect(text: string, options?: amazonEffectOptions): this;
  /**
   * Convenience method for doing amazon:effect name="whisper"
   */
  whisper(text: string): this;
  /**
   * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference#break
   * defaults to <break strength="strong">
   */
  break(options?: breakOptions): this;
  /**
   * convenience method for calling "break". This one only accepts a time param. If you need to use a break, with the "strength" attr, then use break();
   */
  pause(time?: string): this;
  /**
   * outputs the speech markup as a string. This does not include the root <speak></speak> node in the output`
   * if you are working with the official `alexa-sdk` then the `emit()` fn will wrap the ssml with the <speak> node for you
   * if you need the <speak> nodes then use the `outputWithRootNode()` fn
   */
  output(): string;
  /**
   * outputs the markup as a string just like the `output()` fn, except this includes wraps with the root <speak></speak> nodes
   */
  outputWithRootNode(): string;
}
export interface readAsNumberedListOptions {
  pause?: string;
}
export interface readAsOrdinalListOptions {
  pause?: string;
}
export interface readAsListOptions {
  lastSeparator?: string;
  pauseBeforeSeparator?: string;
  pauseAfterSeparator?: string;
  separator?: string;
}
export interface emphasisOptions {
  level?: string;
}
export interface phonemeOptions {
  alphabet?: string;
  ph?: string;
}
export interface subOptions {
  alias?: string;
}
export interface sayAsOptions {
  interpretAs?: string;
  format?: string;
}
export interface wOptions {
  role?: string;
}
export interface prosodyOptions {
  rate?: string;
  pitch?: string;
  volume?: string;
}
export interface amazonEffectOptions {
  name?: string;
}
export interface breakOptions {
  time?: string;
  strength?: string;
}

