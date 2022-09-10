# react-iframe-mate
> React iframe mate component.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
npm install -S @jswork/react-iframe-mate
```

## usage
1. import css
  ```scss
  @import "~@jswork/react-iframe-mate/dist/style.css";

  // or use sass
  @import "~@jswork/react-iframe-mate/dist/style.scss";

  // customize your styles:
  $react-iframe-mate-options: ()
  ```
2. import js
  ```js
  import React from 'react';
  import ReactIframeMate from '@jswork/react-iframe-mate';
  import styled from 'styled-components';

  const Container = styled.div`
    width: 80%;
    margin: 30px auto 0;
  `;

  export default (props: any) => {
    return (
      <Container>
        <ReactIframeMate />
      </Container>
    );
  };

  ```

## preview
- https://afeiship.github.io/react-iframe-mate/

## license
Code released under [the MIT license](https://github.com/afeiship/react-iframe-mate/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/react-iframe-mate
[version-url]: https://npmjs.org/package/@jswork/react-iframe-mate

[license-image]: https://img.shields.io/npm/l/@jswork/react-iframe-mate
[license-url]: https://github.com/afeiship/react-iframe-mate/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/react-iframe-mate
[size-url]: https://github.com/afeiship/react-iframe-mate/blob/master/dist/react-iframe-mate.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/react-iframe-mate
[download-url]: https://www.npmjs.com/package/@jswork/react-iframe-mate
