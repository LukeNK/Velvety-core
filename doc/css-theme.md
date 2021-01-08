## color-palette.css
Import is by using :
```html
<link rel="stylesheet" href="/etc/file/appearance/color-palette.css" type="text/css">
```
It's location in the system is `/etc/appearance/color-palette.css` \
This file usually call "theme"

This file will have many colors for use, but there must be at least two basic color: `--background-color` and `--text-color`. Other is `primary-x` and `secondary-x`, where `x` is a number. You should have fallback in case there is no primary and secondary color.