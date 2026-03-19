# FAQ

## Why VitePress instead of Storybook?

This project is docs-first. The public site needs installation guidance, API documentation, and a few strong interactive demos more than a full component catalog.

## Why is there still a playground directory?

The playground acts as the local development host for the same demo components embedded in the docs. It is not a second public site.

## Do I have to use Tailwind in my app?

No. Tailwind is used for development ergonomics and the playground UI. Consumers only need the built `style.css` from the package.