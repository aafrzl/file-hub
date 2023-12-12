import { Button } from '@/components/ui/button';
import { SignInButton, currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import heroImage from '@/public/Images/hero-images.png';

export default async function Home() {
  const user = await currentUser();

  return (
    <main className="mx-auto max-w-screen-xl gap-12 px-4 py-24 md:px-8">
      <div className="mx-auto max-w-4xl space-y-5 text-center">
        <div className="inline-flex items-center space-x-1 uppercase">
          <h1 className="text-3xl font-bold">Welcome to</h1>
          <h1 className="text-3xl font-bold">
            File<span className="rounded-md bg-yellow-500 p-1">Hub</span>
          </h1>
        </div>
        <h2 className="mx-auto text-4xl font-extrabold md:text-5xl">
          The best way to share files and upload them to the cloud.
        </h2>
        <p className=" mx-auto max-w-2xl">
          Storing files on your computer can be a pain. FileHub makes it easy to
          upload files to the cloud and share them with your friends.
        </p>
        <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
          {!user && (
            <SignInButton
              mode="modal"
              afterSignInUrl="/dashboard"
              afterSignUpUrl="/dashboard">
              <Button
                size={'lg'}
                variant={'secondary'}
                className="w-1/2 sm:w-auto">
                Get Started
              </Button>
            </SignInButton>
          )}
          {user && (
            <Link
              href="/dashboard"
              className="flex h-11 w-1/2 items-center justify-center rounded-md bg-secondary px-8 text-secondary-foreground hover:bg-secondary/80 sm:w-auto">
              Go to dashboard
            </Link>
          )}
        </div>
      </div>
      <div className="mt-14">
        <Image
          src={heroImage}
          width={500}
          height={500}
          priority
          alt="hero image"
          className="mx-auto w-[80%] rounded-xl border shadow-lg"
        />
      </div>
    </main>
  );
}
