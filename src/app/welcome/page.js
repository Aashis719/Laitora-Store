import { SignUpButton } from '@clerk/nextjs';

const Welcome = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome to Laitora!</h1>
      <p className="mt-4">Create an account to start shopping for fresh dairy products.</p>
      <SignUpButton className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        Sign Up
      </SignUpButton>
    </div>
  );
};

export default Welcome;
