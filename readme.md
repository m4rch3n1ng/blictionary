# blictionary

## entries

entries are stored as json files in a directory called `entries`  
the json file names should follow the convention `[id].json`, with `[id]` following the regex of `/^[1-9][0-9]*$`  
**be aware: the directory with the entires *must* be in the directory of the *terminal* when executing**

you can look at the type definition for an `Entry` [here](./src/lib/entry.ts).

## build

you need to have [node.js v16 or above](https://nodejs.org/en/) and [npm v8 or above](https://www.npmjs.com/package/npm)

to initialize the project download it and run

```
$ npm install
```

to build/compile the project run

```
$ npm run build
```

you can run the project by either running

```
$ node build/
```

or

```
$ cd build/
$ node .
```

**be aware: the directory with the entries *must* be in the directory of the *terminal* when executing**

## misc

credit for the (temporary) icon goes to [reksi](https://snipfeed.co/reksi)! thank you!
