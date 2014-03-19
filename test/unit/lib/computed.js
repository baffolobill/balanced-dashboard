module('Balanced.computed');

test('Balanced.computed.sum', function(assert) {
	var TestObject = Ember.Object.extend({
		part: Balanced.computed.sum('full', 'amount'),
	});

	t = TestObject.create();
	assert.equal(t.get('part'), 0);

	var ARRAY_LENGTH = 10, AMOUNT = 5;

	var Credit = Ember.Object.extend({
		amount: AMOUNT
	});

	var creditArr = [];
	for (var i = ARRAY_LENGTH; i > 0; i--) {
		creditArr.pushObject(Credit.create());
	}


	t = TestObject.create({
		full: creditArr
	});
	assert.equal(t.get('part'), ARRAY_LENGTH * AMOUNT);

	t.get('full').pushObject(Credit.create());
	assert.equal(t.get('part'), (ARRAY_LENGTH + 1) * AMOUNT);
});

test('Balanced.computed.slice', function(assert) {
	var TestObject = Ember.Object.extend({
		part: Balanced.computed.slice('full', 1),
		partWay: Balanced.computed.slice('full', 1, 3),
	});

	t = TestObject.create();
	assert.equal(t.get('part').length, 0);
	assert.equal(t.get('partWay').length, 0);


	t = TestObject.create({
		full: [1, 2, 3, 4, 5]
	});
	assert.equal(t.get('part').length, 4);
	assert.equal(t.get('partWay').length, 2);
	assert.deepEqual(t.get('part'), [2, 3, 4, 5]);
	assert.deepEqual(t.get('partWay'), [2, 3]);
});

test('Balanced.computed.concat', function(assert) {
	var TestObject = Ember.Object.extend({
		flippedHref: Balanced.computed.concat('id', '/test/'),
		href: Balanced.computed.concat('id', '/test/', true)
	});

	t = TestObject.create();
	assert.equal(t.get('href'), '/test/');
	assert.equal(t.get('flippedHref'), '/test/');

	t = TestObject.create({
		id: 1
	});
	assert.equal(t.get('href'), '/test/1');
	assert.equal(t.get('flippedHref'), '1/test/');

	Ember.run(function() {
		t.set('id', '8');
	});
	assert.equal(t.get('href'), '/test/8');
	assert.equal(t.get('flippedHref'), '8/test/');
});

test('Balanced.computed.fmt', function(assert) {
	var TestObject = Ember.Object.extend({
		starred: Balanced.computed.fmt('value', '** %@ **'),
		labeled: Balanced.computed.fmt('label', 'value', '%@: %@')
	});

	var t = TestObject.create({
		value: 'test'
	});
	assert.equal(t.get('starred'), '** test **', 'injects the value into the format-string');
	assert.equal(t.get('labeled'), ': test', 'injects single value into the format-string');

	t = TestObject.create({
		label: 'Name',
		value: 'Kaylee'
	});
	assert.equal(t.get('starred'), '** Kaylee **', 'injects the value into the format-string');
	assert.equal(t.get('labeled'), 'Name: Kaylee', 'injects multiple values into the format-string');

	Ember.run(function() {
		t.set('label', 'First Name');
	});

	assert.equal(t.get('labeled'), 'First Name: Kaylee', 'recomputes');

	t = TestObject.create();
	assert.equal(t.get('starred'), '**  **', 'injects empty string values into the format-string');
	assert.equal(t.get('labeled'), ': ', 'injects empty string values into the format-string');
});
