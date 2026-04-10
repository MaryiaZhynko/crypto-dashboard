import { Dashboard } from '~/components/dashboard';
import type { Route } from './+types/home';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: 'Crypto Dashboard' },
    { name: 'description', content: 'Welcome to Crypto Dashboard!' },
  ];
}

export default function Home() {
  return <Dashboard />;
}
