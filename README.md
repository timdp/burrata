# Burrata

[![npm](https://img.shields.io/npm/v/burrata.svg)](https://www.npmjs.com/package/burrata) [![Dependencies](https://img.shields.io/david/timdp/burrata.svg)](https://david-dm.org/timdp/burrata) [![Build Status](https://img.shields.io/circleci/project/github/timdp/burrata/master.svg?label=build)](https://circleci.com/gh/timdp/burrata) [![Coverage Status](https://img.shields.io/coveralls/timdp/burrata/master.svg)](https://coveralls.io/r/timdp/burrata) [![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com/)

Robust, developer-friendly postMessage.

## Usage

1. Load `dist/burrata.js` with a `<script>` tag. This will put the `burrata`
   object on the `window`.

2. Create an instance of `Master`, register some commands, and call `init()` to
   listen for commands from slaves:

    ```js
    const master = new burrata.Master()

    // Register the "echo" command, which sends back the value of the "msg" arg.
    master.setHandler('echo', async ({ msg }) => {
      return msg
    })

    // Start listening for commands.
    master.init()
    ```

3. Add an `<iframe>` for each slave. In the iframe HTML document, load
   `burrata.js` again and set up the slave:

    ```js
    // Choose a unique ID for this slave.
    const id = '123'
    const slave = new burrata.Slave(id)

    // Connect to master.
    await slave.init()

    // Call "echo" on master and print the result.
    const response = await slave.send('echo', { msg: 'Hello!' })
    console.log('Response: ' + response)
    ```

Slaves can define command handlers using the same API. See the [demo](demo/) for
more examples.

## Known Issues

- Coverage reporting is partly broken. Actual coverage is higher.

## Author

[Tim De Pauw](https://tmdpw.eu/)

## License

MIT
