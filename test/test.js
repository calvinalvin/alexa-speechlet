const Speechlet = require('../index.js');
const assert = require('assert');
const _ = require('lodash');

describe('Alexa speechlet tests', function() {
  describe('test escaping of special characters', function() {
    it("escapes &, <, >", function() {
      let speechlet = new Speechlet("Testing escaping.");
      let ssml = speechlet.sentence("This & that")
                          .sentence("1 is < 2")
                          .sentence("3 is > 2")
                          .output();

      assert.equal(ssml, `Testing escaping.<s>This  and  that</s><s>1 is  less than  2</s><s>3 is  greater than  2</s>`);
    });
  });

  describe('#multiple sentences', function() {
    it("Works with multiple sentences.", function() {
      let speechlet = new Speechlet();
      let ssml = speechlet.sentence("This is the first sentence.")
                          .sentence("This is the second sentence.")
                          .output();

      assert.equal(ssml, "<s>This is the first sentence.</s><s>This is the second sentence.</s>");
    });

    it("Works with speechlet outputs sent into new sentences.", function() {
      let speechlet = new Speechlet();
      let ssml = speechlet.sentence("This is the first sentence.")
                          .sentence("This is the second sentence.")
                          .output();

      let speechlet2 = new Speechlet();
      let ssml2 = speechlet2.sentence(ssml).output();

      assert.equal(ssml2, "<s> less than s greater than This is the first sentence. less than /s greater than  less than s greater than This is the second sentence. less than /s greater than </s>");
    });
  });

  describe("#outputWithRootNode()", function() {
    it("Wraps with <speak> tags", function() {
      let speechlet = new Speechlet("Hi there.");
      let ssml = speechlet.outputWithRootNode();
      assert.equal(ssml, "<speak>Hi there.</speak>");
    })
  });

  describe("#audio()", function() {
    it("Adds <audio> tag with src attribue", function() {
      let speech = new Speechlet();
      let ssml = speech.audio("http://example.com/audio_file.mp3");
      assert(ssml, `<audio src="https://example.com/audio_file.mp3" />`);
    });
  });

  describe("#sub()", function() {
    it("Adds <sub> tag with alias attribue", function() {
      let speech = new Speechlet();
      let ssml = speech.say("My favorite chemical element is ")
                      .sub("Al", { alias: "aluminum" })
                      .output();
      assert(ssml, `My favorite chemical element is <sub alias="aluminum">Al</sub>`);
    });
  });

  describe("#w()", function() {
    it("Add <w> tag with role attribute", function() {
      let speech = new Speechlet();
      let ssml = speech.say(`The past tense of read is.`)
                        .w("read", { role: "amazon:VBD" })
                        .output();

      assert.equal(ssml, `The past tense of read is.<w role="amazon:VBD">read</w>`);
    });
  });

  describe("#w() convenience method sayAsVerb()", function() {
    it("Add <w> tag with role amazon:VB attribute", function() {
      let speech = new Speechlet();
      let ssml = speech.sayAsVerb(`read`)
                        .output();

      assert.equal(ssml, `<w role="amazon:VB">read</w>`);
    });
  });

  describe("#w() convenience method sayAsNoun()", function() {
    it("Add <w> tag with role amazon:NN attribute", function() {
      let speech = new Speechlet();
      let ssml = speech.sayAsNoun(`read`)
                        .output();

      assert.equal(ssml, `<w role="amazon:NN">read</w>`);
    });
  });

  describe("#w() convenience method sayAsPastParticiple()", function() {
    it("Add <w> tag with role amazon:VBD attribute", function() {
      let speech = new Speechlet();
      let ssml = speech.sayAsPastParticiple(`read`)
                        .output();

      assert.equal(ssml, `<w role="amazon:VBD">read</w>`);
    });
  });

  describe("#say()", function() {
    it("Does not mutate the text", function() {
      let speech = new Speechlet();
      let ssml = speech.say(`<s>When <emphasis level="strong">I</emphasis> wake up, <prosody rate="x-slow">I speak quite slowly</prosody></s>`).output();
      assert.equal(ssml, `<s>When <emphasis level="strong">I</emphasis> wake up, <prosody rate="x-slow">I speak quite slowly</prosody></s>`);
    });
  });

  describe("#raw()", function() {
    it("Does not mutate the text", function() {
      let speech = new Speechlet();
      let ssml = speech.raw(`<s>When <emphasis level="strong">I</emphasis> wake up, <prosody rate="x-slow">I speak quite slowly</prosody></s>`).output();
      assert.equal(ssml, `<s>When <emphasis level="strong">I</emphasis> wake up, <prosody rate="x-slow">I speak quite slowly</prosody></s>`);
    });
  });

  describe("#emphasis()", function() {
    it("Adds <emphasis> tags to text with level", function() {
      let speechlet = new Speechlet("Hi there.");
      let ssml = speechlet.emphasis("how are you", { level: "strong" }).output();
      assert.equal(ssml, `Hi there.<emphasis level="strong">how are you</emphasis>`);
    });
  });

  describe("#pause()", function() {
    it("Adds <break> tag to text", function() {
      let speechlet = new Speechlet("Hi I speak with long pauses.");
      let ssml = speechlet.pause("2s").say("I know").pause("3s").say("I'm weird").output();
      assert.equal(ssml, `Hi I speak with long pauses.<break time="2s" />I know<break time="3s" />I'm weird`);
    });
  });

  describe("#prosody", function() {
    it("Adds <prosody> tags", function() {
      let speechlet = new Speechlet();
      let ssml = speechlet.prosody("WAAA").output();
      assert.equal(ssml, "<prosody>WAAA</prosody>");
    });

    it("Adds <prosody> tags with rate", function() {
      let speechlet = new Speechlet();
      let ssml = speechlet.prosody("WAAA", { rate: '100%' }).output();
      assert.equal(ssml, `<prosody rate="100%">WAAA</prosody>`);
    });

    it("Adds <prosody> tags with pitch", function() {
      let speechlet = new Speechlet();
      let ssml = speechlet.prosody("WAAA", { pitch: 'x-low' }).output();
      assert.equal(ssml, `<prosody pitch="x-low">WAAA</prosody>`);
    });

    it("Adds <prosody> tags with volume", function() {
      let speechlet = new Speechlet();
      let ssml = speechlet.prosody("WAAA", { volume: 'x-soft' }).output();
      assert.equal(ssml, `<prosody volume="x-soft">WAAA</prosody>`);
    });
  });

  describe('#sentence()', function() {
    it('wraps output with <s></s>', function() {
      let speechlet = new Speechlet();
      let ssml = speechlet.sentence("hi my name is alexa").output();
      assert.equal(ssml, "<s>hi my name is alexa</s>");
    });
  });

  describe('#sayAs()', function() {
    it('can interpretAs digits', function() {
      let speechlet = new Speechlet("I can count.");
      let ssml = speechlet.sayAs("1234", {interpretAs: "digits"}).output();
      assert.equal(ssml, `I can count.<say-as interpret-as="digits">1234</say-as>`);
    });
  });

  describe('#sayAs convenience methods', function() {
    let interpretAs = [
      'characters',
      'spell-out',
      'cardinal',
      'ordinal',
      'digits',
      'fraction',
      'unit',
      'date',
      'time',
      'telephone',
      'address',
      'interjection'
    ];

    interpretAs.forEach((as) => {
      it(`testing convenience method sayAs${_.capitalize(_.camelCase(as))}()`, function() {
        let text = "blahblahblah";
        let speechlet = new Speechlet();
        let ssml = speechlet[`sayAs${_.capitalize(_.camelCase(as))}`](text).output();
        assert.equal(ssml, `<say-as interpret-as="${as}">${text}</say-as>`);
      });
    });
  });

  describe("#sayAsDate", function() {
    it(`testing convenience method for sayAsDate because it accepts an extra "format" param`, function() {
      let speechlet = new Speechlet();
      let format = "mdy";
      let ssml = speechlet.sayAsDate("September 2, 2015", "mdy").output();
      assert.equal(ssml, `<say-as interpret-as="date" format="mdy">September 2, 2015</say-as>`);
    });
  });

  describe('#whisper()', function() {
    it('can whisper with amazon:effect', function() {
      let speechlet = new Speechlet("I have a secret.");
      let ssml = speechlet.whisper("I'm not a real human").output();
      assert.equal(ssml, `I have a secret.<amazon:effect name="whispered">I'm not a real human</amazon:effect>`);
    });
  });

  describe("#pause", function() {
    it("can add break with defaults", function() {
      let ssml = new Speechlet("I can count.").pause().sayAs("12345", {interpretAs: "digits"}).output();
      assert.equal(ssml, `I can count.<break time="0.8s" /><say-as interpret-as="digits">12345</say-as>`);
    })
  });

  describe("test chaining fn calls", function() {
    it("can chain multiple calls", function() {
      let speech = new Speechlet("Hi my name is Alexa.");
      let ssml = speech.sentence("I have a secret to tell you")
                        .whisper("I'm not a real human")
                        .sentence("Right?")
                        .output();
      assert.equal(ssml, `Hi my name is Alexa.<s>I have a secret to tell you</s><amazon:effect name="whispered">I'm not a real human</amazon:effect><s>Right?</s>`);
    });
  });
});
