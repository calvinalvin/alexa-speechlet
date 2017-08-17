const Speechlet = require('../index.js');
const assert = require('assert');
const _ = require('lodash');

describe('Alexa speechlet tests', function() {
  describe("#outputWithRootNode()", function() {
    it("Wraps with <speak> tags", function() {
      let speechlet = new Speechlet("Hi there.");
      let ssml = speechlet.outputWithRootNode();
      assert.equal(ssml, "<speak>Hi there.</speak>");
    })
  });

  describe("#emphasis()", function() {
    it("Adds <emphasis tags to text with level", function() {
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
      assert.equal(ssml, `I can count.<break strength="strong" /><say-as interpret-as="digits">12345</say-as>`);
    })
  });
});
