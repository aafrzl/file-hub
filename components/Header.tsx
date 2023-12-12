import Link from 'next/link';
import { ModeToggle } from './Theme-Toggle';
import { SignInButton, SignedOut, UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-10">
      <Link href={'/'}>
        <h1 className="text-xl font-bold uppercase">
          File<span className="rounded-md bg-yellow-500 p-1">Hub</span>
        </h1>
      </Link>
      <nav className="flex items-center space-x-2 px-5">
        {/* Theme Toggler */}
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
        <SignedOut>
          <SignInButton
            afterSignInUrl="/"
            mode="modal"
          />
        </SignedOut>
      </nav>
    </header>
  );
}
