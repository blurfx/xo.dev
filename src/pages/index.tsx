import Link from 'next/link';
import BaseLayout from '../layouts/BaseLayout';

const IndexPage = (): JSX.Element => (
  <BaseLayout title='Home | Next.js + TypeScript Example'>
    <h1>Hello Next.js 👋</h1>
    <p>
      <Link href='/about'>
        <a href='/about'>About</a>
      </Link>
    </p>
  </BaseLayout>
);

export default IndexPage;
