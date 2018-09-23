# bookish

A book identifier translator. I built this because I needed it, to organize
my bespoke book journal system. It takes various types of book identifiers,
and tries to find their equivalents in other identifier spaces.

### You might want this if

You really want to permalink different references for the same book: have
a direct link to the goodreads page, WorldCat listing, Library of Congress
lookup page, and so on. Linking to redirects is a bummer. This gives you the
information you need to permalink the canonical URL.

You might have exited some service that organized your books but didn't give
you even the most basic of identifiers like ISBN codes.

You might want to learn more about library organization and how book identifiers
are managed and created. It's really cool.

### What's in the box

This is a multi-layered cake: the project is

- A Node.js module
- A REST API
- A web interface

You can interact with it at any of the 3 levels of abstraction and get the same
answers. If you want to run a few queries, you'll probably want to use the web
interface. But if you're writing software, you might want the Node.js module.
