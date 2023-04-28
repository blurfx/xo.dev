import { FileTextIcon, GitHubLogoIcon, HomeIcon } from '@radix-ui/react-icons';

import { Link } from '~/components/header/link';
import ThemeSwitch from '~/components/header/theme-switch';

import { Container, Nav, Separator } from './styles';
export const Header = () => {
  return (
    <Container>
      <Nav>
        <Link href='/' aria-label={'Home'}>
          <HomeIcon />
        </Link>
        <Link href='/articles' aria-label={'Articles'} allowSubpath={true}>
          <FileTextIcon />
        </Link>
        <Separator decorative orientation='vertical' />
        <Link href='https://github.com/blurfx' aria-label={'GitHub'}>
          <GitHubLogoIcon />
        </Link>
        <ThemeSwitch />
      </Nav>
    </Container>
  );
};
