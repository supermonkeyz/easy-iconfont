# Intro

Easy generate font icons automatically with Gulp

# Installation

npm install

# Basic Usage

## DEV

You can drop your svg files into the src path, just like:`./src/svgs`, then your iconfont will change automatically

```
npm run dev
```
OR
```
gulp dev
```

## Build

You will get fonts、css、html、 json files. Choose what you want

```
npm run build
```
OR
```
gulp build
```

## Config

You can modify values in config.js, something like this will compile with your own font name、class name、template files name、generated files name

``` javascript
{
  fontName: 'easyfont',
  className: 'e-iconfont',
  inputName: '_template',
  outputName: 'iconfont'
}
```