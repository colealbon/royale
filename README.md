# hotlips
seed/starter project using koa2, rebel-router
* [test driven](https://github.com/colealbon/hotlips/tree/master/test) javascript development
* [isomorphic functions](https://github.com/colealbon/hotlips/blob/master/src/lib/)
* serverless immutable transactions
* use of pgp cryptographic primitives
* webpack deployment
* es7 async/await flow control (or at least promise based)
* heavy use of promise aware partial application (anticipating aggressive memoize caching)

# installation
```
git clone https://github.com/colealbon/royale.git
cd royale;
npm install;
(modify config/options.js if needed)
npm test;
npm start;   
```

# usage   
navigate to localhost:3000 (or settings from config/options.js)

# todo
- ~~Install node/koa/webpack~~
- ~~Install [gundb](http://gun.js.org/)~~
- ~~make a [deck of cards](https://github.com/colealbon/royale/blob/master/views/partials/freshdeck.html)~~
- ~~install rebel router~~
- [Alice and Bob exchange keys](http://localhost:3000/#/message)
- [Mental Poker](https://en.wikipedia.org/wiki/Mental_poker)
  - Alice and Bob agree on a certain "deck" of cards. In practice, this means they agree on a set of numbers or other data such that each element of the set represents a card.
  - Alice picks an encryption key A and uses this to encrypt each card of the deck.
  - Alice shuffles the cards.
  - Alice passes the encrypted and shuffled deck to Bob. With the encryption in place, Bob cannot know which card is which.
  - Bob shuffles the deck.
  - Bob passes the double encrypted and shuffled deck back to Alice.
  - Alice decrypts each card using her key A. This still leaves Bob's encryption in place though so she cannot know which card is which.
  - Alice picks one encryption key for each card (A1, A2, etc.) and encrypts them individually.
  - Alice passes the deck to Bob.
  - Bob decrypts each card using his key B. This still leaves Alice's individual encryption in place though so he cannot know which card is which.
  - Bob picks one encryption key for each card (B1, B2, etc.) and encrypts them individually.
  - Bob passes the deck back to Alice.
  - Alice publishes the deck for everyone playing (in this case only Alice and Bob, see below on expansion though).
