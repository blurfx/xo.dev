import yaml from 'js-yaml';
import { FrontMatter, PostParseResult } from '@interfaces';

const regex = new RegExp(/^(?:-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/);

const parsePost = (text: string): PostParseResult => {
  const matches = regex.exec(text);
  if (!matches) {
    throw new Error('Cannot find front-matter');
  }
  const frontmatter = yaml.load(matches[1]) as FrontMatter;
  const content = matches[2];

  return {
    content,
    frontmatter,
  };
};

export default parsePost;
