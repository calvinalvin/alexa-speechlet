const Speechlet = require('../index.js');
const assert = require('assert');
const _ = require('lodash');

describe('Alexa speechlet tests', function() {
  describe('#sentence()', function() {
    it('should append a period to the end', function() {
      let speechlet = new Speechlet();
      let ssml = speechlet.sentence("hi my name is alexa").output();
      assert.equal(ssml, "hi my name is alexa.");
    });

    it('should not append a period if it already has one', function() {
      let speechlet = new Speechlet();
      let ssml = speechlet.sentence("hi my name is alexa.").output();
      assert.equal(ssml, "hi my name is alexa.");
    });

    it('should not append a period if ends in question mark.', function() {
      let speechlet = new Speechlet();
      let ssml = speechlet.sentence("are you ok?").output();
      assert.equal(ssml, "are you ok?");
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
