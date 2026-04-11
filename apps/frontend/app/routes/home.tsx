import type { Route } from './+types/home';

import { HomeContent } from '~/components/dashboard/home-content';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: 'Crypto Dashboard' },
    { name: 'description', content: 'Welcome to Crypto Dashboard!' },
  ];
}

export default function Home() {
  return <HomeContent />;
}
