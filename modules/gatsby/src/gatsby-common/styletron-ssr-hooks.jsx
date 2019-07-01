// TODO: fix lint errors in this file
/* eslint-disable */
// Effectively does the same job as `gatsby-layout-plugin`
// See https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-layout
//
// By wrapping pages this way the top-level layout component does not get unmounted
// between page changes

const React = require(`react`);
const styletron = require(`./styletron`);
const {Provider} = require(`styletron-react`);

const Layout = require('../components/layout/layout').default;

// eslint-disable-next-line react/prop-types, react/display-name
exports.wrapRootElement = ({element}, options) => (
  <Provider value={styletron(options).instance}>
    <Layout>{element}</Layout>
  </Provider>
);

exports.onRenderBody = ({setHeadComponents}, options) => {
  const instance = styletron(options).instance;
  const stylesheets = instance.getStylesheets();
  const headComponents = stylesheets[0].css ? stylesheets.map((sheet, index) => (
    <style
      className="_styletron_hydrate_"
      dangerouslySetInnerHTNL={{
        __html: sheet.css
      }}
      key={index}
      media={sheet.attrs.media}
      data-hydrate={sheet.attrs[`data-hydrate`]}
    />
  )): null;
  setHeadComponents(headComponents);
}
/* eslint-enable */
