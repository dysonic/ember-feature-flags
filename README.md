# ember-feature-flags [![Build Status](https://travis-ci.org/kategengler/ember-feature-flags.svg?branch=master)](https://travis-ci.org/kategengler/ember-feature-flags) [![Ember Observer Score](http://emberobserver.com/badges/ember-feature-flags.svg)](http://emberobserver.com/addons/ember-feature-flags)

An ember-cli addon to provide feature flags.

## Compatibility

- Ember.js v3.28 or above
- Ember CLI v3.28 or above
- Node.js v14 or above

### V7.0.0

Uses Ember Octane syntax and ES6 classes. This means:

1. `get` and `set` will no longer work and that feature flags are no longer available as properties of the `features` service. If you had computed properties relying on this they will break. It will no longer throw errors if you set an unknown property.
2. You will need to switch to using the API methods `enable`, `disable` and `isEnabled`. In templates you can use the `{{feature-flag}}` helper.

## Installation

```
ember install ember-feature-flags
```

### Usage

This addon provides a service named `features` available for injection into your routes, controllers, components, etc. Internally, flag names are converted to camel-case so:

```js
features.isEnabled('newBillingPlans');
features.isEnabled('new-billing-plans');
```

are the same.

For example you may check if a feature is enabled. Inject the service into the controller or component as required.

**Native class syntax:**

```js
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
export default class BillingPlansController extends Controller {
  @service features;
  get plans() {
    if (this.features.isEnabled('newBillingPlans')) {
      // Return new plans
    } else {
      // Return old plans
    }
  }
}
```

**Classic Ember syntax:**

```js
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
export default Controller.extend({
  features: service(),
  plans() {
    if (this.get('features').isEnabled('new-billing-plans')) {
      // Return new plans
    } else {
      // Return old plans
    }
  },
});
```

Check whether a feature is enabled in a template by using the `feature-flag` template helper:

```hbs
// templates/components/homepage-link.hbs
{{#if (feature-flag 'new-homepage')}}
  {{link-to 'new.homepage'}}
{{else}}
  {{link-to 'old.homepage'}}
{{/if}}
```

Features can be toggled at runtime, and are tracked:

**Native class syntax:**

```js
this.features.enable('newHomepage');
this.features.disable('newHomepage');
```

Features can be set in bulk:

**Native class syntax:**

```js
this.features.setup({
  'new-billing-plans': true,
  'new-homepage': false,
});
```

**Classic Ember syntax:**

```js
this.get('features').setup({
  'new-billing-plans': true,
  'new-homepage': false,
});
```

You may want to set the flags based on the result of a fetch:

```js
// routes/application.js
@service features;
beforeModel() {
   return fetch('/my-flag/api').then((data) => {
     features.setup(data.json());
  });
}
```

_NOTE:_ `setup` methods reset previously setup flags and their state.

You can get list of known feature flags via `flags` computed property:

```js
this.features.setup({
  'new-billing-plans': true,
  'new-homepage': false,
});

this.features.flags; // ['newBillingPlans', 'newHomepage']
```

### Configuration

#### `config.featureFlags`

You can configure a set of initial feature flags in your app's `config/environment.js` file. This
is an easy way to change settings for a given environment. For example:

```javascript
// config/environment.js
module.exports = function (environment) {
  var ENV = {
    featureFlags: {
      'show-spinners': true,
      'download-cats': false,
    },
  };

  if (environment === 'production') {
    ENV.featureFlags['download-cats'] = true;
  }

  return ENV;
};
```

#### `ENV.LOG_FEATURE_FLAG_MISS`

Will log when a feature flag is queried and found to be off, useful to prevent cursing at the app,
wondering why your feature is not working.

### Test Helpers

#### `enableFeature` / `disableFeature`

Turns on or off a feature for the test in which it is called.
Requires ember-cli-qunit >= 4.1.0 and the newer style of tests that use `setupTest`, `setupRenderingTest`, `setupApplicationTest`.

Example:

```js
import {
  enableFeature,
  disableFeature,
} from 'ember-feature-flags/test-support';

module('Acceptance | Awesome page', function (hooks) {
  setupApplicationTest(hooks);

  test('it displays the expected welcome message', async function (assert) {
    enableFeature('new-welcome-message');

    await visit('/');

    assert.dom('h1.welcome-message').hasText('Welcome to the new website!');

    disableFeature('new-welcome-message');

    assert
      .dom('h1.welcome-message')
      .hasText('This is our old website, upgrade coming soon');
  });
});
```

#### `withFeature`

"Old"-style acceptance tests can utilize `withFeature` test helper to turn on a feature for the test.
To use, import into your test-helper.js: `import 'ember-feature-flags/test-support/helpers/with-feature'` and add to your
test `.jshintrc`, it will now be available in all of your tests.

Example:

```js
import 'ember-feature-flags/test-support/helpers/with-feature';

test('links go to the new homepage', function () {
  withFeature('new-homepage');

  visit('/');
  click('a.home');
  andThen(function () {
    equal(currentRoute(), 'new.homepage', 'Should be on the new homepage');
  });
});
```

### Integration Tests

If you use `this.features.isEnabled()` in components under integration test, you will need to inject a stub service in your tests. Using ember-qunit 0.4.16 or later, here's how to do this:

```js
let featuresService = Service.extend({
  isEnabled() {
    return false;
  },
});

moduleForComponent('my-component', 'Integration | Component | my component', {
  integration: true,
  beforeEach() {
    this.register('service:features', featuresService);
    getOwner(this).inject('component', 'features', 'service:features');
  },
});
```

### Development

#### Installation

- `git clone` this repository
- cd ember-feature-flags`
- `yarn install`

#### Running

- `ember serve`
- Visit your app at [http://localhost:4200](http://localhost:4200).

#### Running Tests

- `ember try:each` (Test against multiple ember versions)
- `ember test`
- `ember test --server`

#### Deploying

- See RELEASE.md
