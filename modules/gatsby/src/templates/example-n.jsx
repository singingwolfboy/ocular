import React from 'react';

import {graphql} from 'gatsby';
import {AutoSizer} from 'react-virtualized';

import {MainExample} from '../components/styled';
import ExampleRunner from '../components/example-runner';

/* eslint no-undef: "off" */
export const query = graphql`
  query ExampleBySlug($slug: String!) {
    exampleBySlug: markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        cover
        category
        tags
      }
    }
  }
`;

export default class ExampleTemplate extends React.Component {
  render() {
    const {pageContext, pageResources} = this.props;
    const {slug} = pageContext;

    // Get app website's example runner
    const EXAMPLES = getExamples();
    const example = EXAMPLES[slug];
    if (!example) {
      console.warn(`No example found: ${slug}`);
    }
    // console.log(example);
    return (
      <MainExample>
        <AutoSizer>
          {({height, width}) => (
            <div id="example-runner">
              {example && (
                <ExampleRunner
                  height={height}
                  example={example}
                  sourceLink={
                    pageResources &&
                    pageResources.page &&
                    pageResources.page.path
                  }
                  width={width}
                />
              )}
            </div>
          )}
        </AutoSizer>
      </MainExample>
    );
  }
}
