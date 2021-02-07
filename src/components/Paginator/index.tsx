import Link from 'next/link';
import React from 'react';
import { Container, PageAnchor } from './styles';

interface PaginatorProps {
  currentPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

const Paginator = ({ currentPage, hasPrevPage, hasNextPage }: PaginatorProps): JSX.Element => {
  const pagingData = [
    {
      className: 'prev',
      delta: -1,
      shouldRender: hasPrevPage,
      text: '〈 Previous',
    },
    {
      className: 'next',
      delta: 1,
      shouldRender: hasNextPage,
      text: 'Next 〉',
    },
  ];

  return (
    <Container>
      { pagingData.map((item) => item.shouldRender && (
        <Link key={item.text} href={`/page/${currentPage + item.delta}`} passHref>
          <PageAnchor className={item.className}>
            { item.text}
          </PageAnchor>
        </Link>
      ))}
    </Container>
  );
};

export default Paginator;
