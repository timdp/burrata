# Burrata

[![npm](https://img.shields.io/npm/v/burrata.svg)](https://www.npmjs.com/package/burrata) [![Dependencies](https://img.shields.io/david/timdp/burrata.svg)](https://david-dm.org/timdp/burrata) [![Build Status](https://img.shields.io/circleci/project/github/timdp/burrata/master.svg?label=build)](https://circleci.com/gh/timdp/burrata) [![Coverage Status](https://img.shields.io/coveralls/timdp/burrata/master.svg)](https://coveralls.io/r/timdp/burrata) [![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com/)

Robust, developer-friendly [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

## Synopsis

Burrata has two modes:

1. **Master-slave mode** assumes that you've got one _master_ document
   containing one or more _slave_ iframes that connect to it. This mode also
   makes it easy to _broadcast_ a message to all slaves.

2. **Peer-to-peer mode** sets up communication between exactly two iframes.

In both modes, bidirectional communication is fully supported. Masters, slaves,
and peers can all define and invoke commands. The distinction between both modes
exists purely to accommodate common use cases.

## Installation

Just use npm (or Yarn) to install Burrata:

```bash
npm install burrata
```

Under `node_modules/burrata`, you'll then find:

- `dist/burrata.js`: the unminified [UMD](https://github.com/umdjs/umd) bundle;
- `dist/burrata.min.js`: the minified [UMD](https://github.com/umdjs/umd) bundle;
- `src/*.js`: the ECMAScript 2018 source files.

To get started, load `dist/burrata.js` using a `<script>` tag, which will make
`burrata` available on the `window`:

```html
<script src="burrata.js"></script>
```

You can also load the bundles directly from [unpkg](https://unpkg.com/) or use
your favorite bundler to build from source.

## Usage

In both modes, it is recommended that you enter a meaningful value for `ns`
(namespace) and `id` (node identifier) where applicable. In the examples below,
we'll use dummy values.

### Master-Slave Mode

1. In the top-level HTML document, create an instance of `Master`. Then,
   register some command handlers; in this case, we're creating a simple `echo`
   command. Finally, call `init()` to start listening for commands from slaves.

    ```js
    const ns = 'testing' // Pick a namespace.
    const master = new burrata.Master({ ns })

    // Register the "echo" command, which sends back the value of the "msg" arg.
    master.setHandler('echo', async ({ msg }) => {
      return msg
    })

    // Start listening for commands.
    master.init()
    ```

2. Add an `<iframe>` for each slave. Inside the iframe, set up the slave.

    ```js
    const ns = 'testing' // The same namespace as for the master.
    const id = 'slave_1' // A unique ID for this slave.
    const slave = new burrata.Slave({ ns, id })

    // Connect to master.
    await slave.init()
    ```

3. Now that everything is wired up, make the slave call its master's `echo`
   command.

    ```js
    const response = await slave.send('echo', { msg: 'Hello!' })
    console.log('Response: ' + response)
    ```

Slaves can define command handlers using the same `setHandler()` function.
Please consult the [demo](demo/master.html) for more examples.

### Peer-to-Peer Mode

In peer-to-peer mode, you create two instances of `burrata.Peer` and await their
`init()` call. Like in master-slave mode, you can use `setHandler()` to define
commands on peers, and `send()` to invoke them.

In most cases, you will also want to pass two additional options to the `Peer`
constructor, alongside `ns` and `id`:

- `source`: the `Window` on which `message` events for the peer will arive;
- `target`: the `Window` on which the peer will call `postMessage()`.

Both options default to the current `window`, which allows two peers to talk to
one another without creating iframes.

To find out more about peer-to-peer mode, please take a look at the
[demo](demo/p2p.html).

## Known Issues

- Coverage reporting is partly broken. Actual coverage is higher.

## Author

[Tim De Pauw](https://tmdpw.eu/)

## License

MIT
