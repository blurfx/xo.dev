import Link from 'next/link';

import { BlogConfig } from 'blog.config';

import { Container } from './styles';

const Footer = () => {
  return (
    <Container>
      © {BlogConfig.name}, Built with{' '}
      <Link href={'https://github.com/blurfx/ambienxo'}>Ambienxo</Link>
    </Container>
  );
};

export default Footer;
