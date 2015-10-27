# Yeoman generator for AngularJS projects

> Opinionated Yeoman generator for creating Angular applications which lazy load components as needed at runtime.

## What's included?

These are the tools and libraries the project stack includes.

### [SystemJS](https://github.com/systemjs/systemjs)
We're using the recently, in ECMAScript 2015, standardized module system. SystemJS builds up on these APIs to make it easier for us to modularize out code properly and to load those modules as they're needed. Since most browsers don't implement the module system natively SystemJS uses the [ES2015 Module Loader Polyfill](https://github.com/ModuleLoader/es6-module-loader) under the hood to close the gap.

Since the ES2015 module loader system is farly new most of the existing JavaScript libraries didn't have the chance yet to migrate to the new syntax. AMD and CommonJS are still the most used systems. SystemJS implements adapters for those module systems so that we're not blocked when it comes to use popular libraries like AngularJS or Lodash which do not yet use the new import / export syntax.

### [JSPM](https://jspm.io)
[NPM](https://www.npmjs.com) is a great package manager but it was initially designed to be used on the server side. There is no straight forward way to load NPM packages in the browser at runtime.g

### [AngularJS](https://angularjs.org)
If you're here then you should know what Angular is.

### [UI Router](http://angular-ui.github.io/ui-router/)
Angular's integrated router has very limited capabilities, e.g. it doesn't support nested views. UI Router gives you much more flexibility and has become the de-facto standard router for Angular applications.

### [UI Router Extras](http://christopherthielen.github.io/ui-router-extras)
UI Router Extras adds even more functionality to the router on top of UI Router. Most important, [Future States](http://christopherthielen.github.io/ui-router-extras/#/future) which enable us to describe, in an abstract way, what states our application has and where the code for those resides, without actually loading the JavaScript code itself. It is then lazy loaded at runtime when the uset accesses the state for the first time.

### [ocLazyLoad](https://oclazyload.readme.io)
By default Angular requires us to load all application code upfront before it boots the application. That works well for smaller applications. For large scale applications this introduces long loading times an impacts the user experience negatively. ocLazyLoad allows us to add modules to Angular applications at runtime.
