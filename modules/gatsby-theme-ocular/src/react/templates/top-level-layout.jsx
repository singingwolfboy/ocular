/* eslint-disable react/no-did-update-set-state */
// This is the top-level "Layout" component that doesn't get unmounted between
// page loads. This component is wrapped around the react component returned by
// each page by 'gatsby-plugin-layout'

import React from 'react';
import Helmet from 'react-helmet';
import MediaQuery from 'react-responsive';
import {ThemeProvider, createGlobalStyle} from 'styled-components';

import {WebsiteConfigProvider} from '../components/website-config';
import SEO from '../components/SEO';
import TableOfContents from '../components/table-of-contents';
import Header from '../components/header';
import DocsHeader from '../components/docs-header';

import defaultTheme from '../default-theme';
import createTheme from '../styled/create-theme';

import {
  BodyContainerFull,
  BodyContainerToC,
  Body
} from '../styled/body';

import {HeaderContainer} from '../styled/header';
import {TocContainer, TocToggle} from '../styled/toc';


const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
  * {
    box-sizing: border-box;
  }
`;

// TODO/ib - restore footer
// import Footer from './footer';

function ResponsiveHeader(props) {
  const HeaderComponent = props.isDocHeader ? DocsHeader : Header;
  return (
    <div>
      <MediaQuery maxWidth={575}>
        <HeaderComponent {...props} isSmallScreen />
      </MediaQuery>
      <MediaQuery minWidth={576}>
        <HeaderComponent {...props} />
      </MediaQuery>
    </div>
  );
}

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isProjectsMenuOpen: false,
      isLinksMenuOpen: false,
      isTocOpen: false
    };
    this.toggleProjectsMenu = this.toggleProjectsMenu.bind(this);
    this.toggleLinksMenu = this.toggleLinksMenu.bind(this);
    this.toggleToc = this.toggleToc.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pageContext.slug !== this.props.pageContext.slug) {
      this.setState({isTocOpen: false});
    }
  }

  getTheme() {
    const {config} = this.props;
    const primitives = Object.assign({}, defaultTheme);
    if (config.THEME_OVERRIDES) {
      Object.assign(primitives, JSON.parse(config.THEME_OVERRIDES));
    }

    return createTheme(primitives);
  }

  toggleLinksMenu() {
    const {isLinksMenuOpen} = this.state;
    this.setState({isLinksMenuOpen: !isLinksMenuOpen});
  }

  toggleProjectsMenu() {
    const {isProjectsMenuOpen} = this.state;
    this.setState({isProjectsMenuOpen: !isProjectsMenuOpen});
  }

  toggleToc() {
    const {isTocOpen} = this.state;
    this.setState({isTocOpen: !isTocOpen});
  }

  renderBodyWithTOC(config, tableOfContents) {
    const {children} = this.props;
    const {isLinksMenuOpen, isProjectsMenuOpen, isTocOpen} = this.state;
    const isMenuOpen = isLinksMenuOpen || isProjectsMenuOpen;
    // first div is to avoid the BodyGrid div className to be overwritten
    return (
      <div>
        <Body>
          <HeaderContainer>
            <ResponsiveHeader
              config={config}
              isLinksMenuOpen={isLinksMenuOpen}
              isProjectsMenuOpen={isProjectsMenuOpen}
              toggleLinksMenu={this.toggleLeftMenu}
              toggleProjectsMenu={this.toggleProjectsMenu}
              isDocHeader
            />
          </HeaderContainer>
          <TocToggle
            toggleToc={this.toggleToc}
            isMenuOpen={isMenuOpen}
            isTocOpen={isTocOpen}
          />
          <TocContainer $isTocOpen={isTocOpen}>
            {this.renderTOC(config, tableOfContents)}
          </TocContainer>

          <BodyContainerToC $isTocOpen={isTocOpen} $isMenuOpen={isMenuOpen}>
            {children}
          </BodyContainerToC>
          {/* <Footer /> */}
        </Body>
      </div>
    );
  }

  renderBodyFull(config) {
    const {children} = this.props;
    const {isMenuOpen} = this.state;
    return (
      <div>
        <HeaderContainer>
          <ResponsiveHeader
            config={config}
            isMenuOpen={isMenuOpen}
            toggleMenu={this.toggleMenu}
          />
        </HeaderContainer>

        <BodyContainerFull>{children}</BodyContainerFull>

        {/* <Footer /> */}
      </div>
    );
  }

  renderTOC(config, tableOfContents) {
    const {pageContext} = this.props;
    switch (pageContext.toc) {
      case 'docs':
        return (
          <TableOfContents
            chapters={tableOfContents.chapters}
            slug={pageContext.slug}
          />
        );

      case 'examples': {
        const {EXAMPLES} = config;

        const examplesTOC = [
          {
            title: 'Examples',
            entries: []
          }
        ];

        // eslint-disable-next-line
        for (const example of EXAMPLES) {
          const exampleEntry = Object.assign(
            {
              entry: example.title
            },
            example
          );
          examplesTOC[0].entries.push(exampleEntry);
        }

        return (
          <TableOfContents
            chapters={examplesTOC}
            firstItemIsExpanded
            slug={pageContext.slug}
          />
        );
      }

      default:
        console.warn(`Unknown toc type ${pageContext.toc}`); // eslint-disable-line
        return null;
    }
  }

  render() {
    // Since gatsby's StaticQueries can't run in a plugin, we rely on the app website's
    // Layout wrapper component to query for us and pass in the data.
    const {
      pageContext,
      config,
      tableOfContents,
      allMarkdown
    } = this.props;

    const theme = this.getTheme();

    return (
      <WebsiteConfigProvider
        value={{config, theme, tableOfContents, allMarkdown}}
      >
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <div>
            {allMarkdown ? (
              <SEO postEdges={allMarkdown} />
            ) : (
              <Helmet>
                <title>{config.PROJECT_NAME}</title>
              </Helmet>
            )}
            {pageContext.toc
              ? this.renderBodyWithTOC(config, tableOfContents)
              : this.renderBodyFull(config)}
          </div>
        </ThemeProvider>
      </WebsiteConfigProvider>
    );
  }
}