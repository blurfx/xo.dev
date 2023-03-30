import type { Post } from 'contentlayer/generated';
import { formatDate, toISODate } from '~/utils/date';

import { Container, Time, Title } from './styles';

type Props = Pick<Post, 'title' | 'date'>;
export const ArticleHeader = ({ title, date }: Props) => {
  const dateObj = new Date(date);
  return (
    <Container>
      <Title>{title}</Title>
      <Time dateTime={toISODate(dateObj)}>{formatDate(dateObj)}</Time>
    </Container>
  );
};
