import React from 'react';
import { Post } from '@interfaces';
import Link from 'next/link';
import Tags from '@components/Tags';
import {
  Container, Title, Date, Excerpt,
} from './styles';

interface Props {
  post: Post;
}

const PostItem = ({ post }: Props): JSX.Element => {
  const {
    date, title, excerpt, tags = [], slug,
  } = post;

  return (
    <Container hasExcerpt={excerpt !== undefined}>
      <Title>
        <Link href={`/${slug}`}>
          <a>
            { title }
          </a>
        </Link>
      </Title>
      <div>
        <Date>{ date }</Date>
        <Tags>
          { tags.map((tag) => <Tags.Tag key={tag} href={`/tags/#${tag}`} label={tag} />)}
        </Tags>
      </div>
      { !excerpt && (
        <div>
          <Excerpt>{ excerpt }</Excerpt>
        </div>
      )}
    </Container>
  );
};

export default PostItem;
