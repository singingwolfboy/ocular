export {default as wrapPageElement} from './src/gatsby-common/wrap-page-browser';

export function onClientEntry() {
  console.log('Ocular loaded'); // eslint-disable-line
}
