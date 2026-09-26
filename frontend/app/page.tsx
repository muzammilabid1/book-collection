import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#25221e]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-[#25221e]"
        >
          Book<span className="text-[#8b5e3c]">Collection</span>
        </Link>

        <Link
          href="/login"
          className="rounded-full border border-[#25221e]/15 px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:bg-[#25221e] hover:text-white"
        >
          Sign In
        </Link>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-100px)] max-w-7xl items-center gap-12 px-6 pb-16 pt-8 lg:grid-cols-2 lg:px-10 lg:pb-20">
        <div className="order-2 max-w-2xl lg:order-1">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-[#8b5e3c]">
            Your personal library
          </p>

          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Keep every book
            <span className="block text-[#8b5e3c]">in one place.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[#6b645b]">
            Organize the books you own, keep your collection accessible, and
            manage it all from one simple space.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-full bg-[#25221e] px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-[#8b5e3c]"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="rounded-full border border-[#25221e]/15 bg-white px-7 py-3.5 font-semibold text-[#25221e] transition-all duration-300 hover:border-[#8b5e3c] hover:text-[#8b5e3c]"
            >
              I Have an Account
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-8 text-sm text-[#777066]">
            <div>
              <p className="font-semibold text-[#25221e]">Simple</p>
              <p className="mt-1">Easy to manage</p>
            </div>

            <div className="h-8 w-px bg-[#25221e]/10" />

            <div>
              <p className="font-semibold text-[#25221e]">Private</p>
              <p className="mt-1">Your collection</p>
            </div>
          </div>
        </div>

        <div className="relative order-1 flex justify-center lg:order-2 lg:justify-end">
          <div className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-[#d9c2a7]/40 blur-3xl" />

          <div className="relative w-full max-w-xl rounded-[2.5rem] bg-[#e8dfd1] p-8 sm:p-12">
            <Image
              src="/reading.svg.svg"
              alt="Person reading a book"
              width={600}
              height={500}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </section>
    </main>
  );
}
