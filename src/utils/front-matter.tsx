import yaml from 'js-yaml';
import { FrontMatter } from '@interfaces';

const regex = new RegExp(/^(?:-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/);

const frontMatter = (text: string): FrontMatter => {
  const matches = regex.exec(text);
  if (!matches) {
    throw new Error('Cannot find front-matter');
  }
  const data = yaml.load(matches[1]);
  return data as FrontMatter;
};

export default frontMatter;
