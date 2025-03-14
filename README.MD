This is a fits and starts attempt at creating a lossless website, e-book, and docs the "right way" (as far as I can tell from watching all of YouTube).

## Why Nix and How Nix

I have been trying to rid myself of the "works on my machine" problem. While Docker will most likely solve it, apparently Nix gets rid of it entirely. Nix has an environment declarative language, and the latest in Nix is to use "flakes." Thus, the "flake.nix" file at root directory is the file that tells Nix how to reproduce the total environment.

### Nix modules to boot.

The primary flakes file calls "flake-modules" from the directory of the same name. The two modules as of 2024-12-30 declare the Node version and the terminal emulator for the "reproduceable environment."

> This starter code works and is stolen from a a tutorial by Peter Koluch [here.](https://blog.eigenvalue.net/2024-astro-starlight-with-nix/)

# Getting Up and Running

Make sure you have the Nix package manager installed.

Open your terminal and assure you are at the root directory of this project. Then, run:

```
nix develop
```

It will open a terminal emulator called "devshell."

The Starlight product created by Astro.build is for "docs" and is located in

```
/docs/
```

The Astro site is in the site directory

```
/site/
```

To upgrade Astro, run

```
cd site
npx @astrojs/upgrade
```

To run the Astro apps on local, you have to create two servers.

```
cd docs
pnpm run dev
```

```
cd site
pnpm run dev
```

## How to clean up YouTube URLs. 

From the `site` directory, put the following command in bash:
```bash
pnpm run format-youtube --src/content/tooling/PATH/FILE_NAME
```


***
# Future Plans
 - [ ] Left and Right Panels
 - [ ] Special handling of youtube links. 
 - [ ] Image handling with text wrap. 