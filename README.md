# Homegrown Site Blocker

a barebones chrome extension to block a list of sites for a specified period of time

- sites are currently hardcoded in a regex, hope to make interactive
- timers are currently hardcoded, hope to make interactive
- `tabs` and `storage` permissions necessary

---

1. navigate to [chrome://extensions/](chrome://extensions/)

1. click `Load unpacked`

1. select the `dist` directory

1. to make any changes, run `npm install` to install the dependencies and `npm run build` to output the compiled changes to the `dist` directory
