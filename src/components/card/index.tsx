import { formatDate, toISODate } from '~/utils/date';

import { Container, Description, Time, Title } from './styles';

type Props = {
  title: string;
  description?: string | null;
  date: string;
  url: string;
};

const Card = (props: Props) => {
  const { title, description, date, url } = props;
  const dateObj = new Date(date);
  return (
    <Container href={url}>
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      <Time dateTime={toISODate(dateObj)}>{formatDate(dateObj)}</Time>
    </Container>
  );
};

export default Card;
