# leantime-keyboard-shortcuts

This is a userscript initiated from
[@violentmonkey/generator-userscript](https://github.com/violentmonkey/generator-userscript).

## Installation

1. Install [the Violentmonkey extension](https://violentmonkey.github.io/#installation) in your browser.
2. Open <https://raw.githubusercontent.com/rimi-itk/UserScripts/main/leantime/dist/keyboard-shortcuts.user.js>
3. Install the script by clicking

## Development

``` sh
# Compile and watch
$ npm run dev

# Build script
$ npm run build

# Lint
$ npm run lint
```

## Testing during development

<https://violentmonkey.github.io/posts/how-to-edit-scripts-with-your-favorite-editor/>

1. Start [`http-server`](https://github.com/http-party/http-server#readme):

   ``` shell
   npx http-server -c5 --port 8787
   ```

2. Open <http://127.0.0.1:8787/dist/keyboard-shortcuts.user.js> in a browser with [the Violentmonkey extension
   installed](https://violentmonkey.github.io/#installation).
3. Press <kbd>⌘-Enter</kbd> (or click the "Track external edits" button if you don't yet use keyboard shortcuts
   exclusively).
4. Open your [Leantime](https://leantime.io/) site.
5. Press <kbd>?</kbd> and enjoy the "Keyboard shortcuts" overlay. If the overlay does not appear, something does not
   work as expected …
6. Open [`src/keyboard-shortcuts/app.tsx`](src/keyboard-shortcuts/app.tsx) in [your favorite
   editor](https://en.wikipedia.org/wiki/Emacs) and start hacking.
7. Your changes should be reflected in your Leantime site when you reload the page.

## Coding standards

``` shell
npm run coding-standards-check
```
