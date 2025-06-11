import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-slate-800 hover:bg-slate-700",
            card: "bg-slate-950/50 backdrop-blur-xl",
          },
        }}
      />
    </div>
  );
}
