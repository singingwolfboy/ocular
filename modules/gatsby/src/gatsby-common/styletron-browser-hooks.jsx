// TODO: fix lint errors in this file
/* eslint-disable */
// Effectively does the same job as `gatsby-layout-plugin`
// See https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-layout
//
// By wrapping pages this way the top-level layout component does not get unmounted
// between page changes

const React = require(`react`);
const {Provider, DebugEngine} = require('styletron-react');

const Layout = require('../components/layout/layout').default;
const Styletron = require('./styletron');


const debug = process.env.NODE_ENV === 'production' ? void 0 : new DebugEngine();

// eslint-disable-next-line react/prop-types, react/display-name
module.exports = ({element}, options) => {
  const enableDebug = 
    options.debug === true || typeof options.debug === 'undefined';

  return (
    <Provider value={styletron(options).instance}
    debug={enableDebug ? debug : undefined}
    debugAfterHydration={enableDebug}
    >
      <Layout>{element}</Layout>
    </Provider>
  );
};

/* eslint-enable */
