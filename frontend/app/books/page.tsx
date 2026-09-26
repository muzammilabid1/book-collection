"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Book = {
  _id: string;
  title: string;
  author: string;
  genre: string;
  user: string;
  createdAt: string;
  updatedAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
};

export default function BooksPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");

  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchUser = async () => {
    const response = await apiFetch("/api/auth/me");

    if (!response.ok) {
      router.replace("/login");
      return false;
    }

    const data = await response.json();
    setUser(data.user);

    return true;
  };

  const fetchBooks = async () => {
    const response = await apiFetch("/api/books");

    if (!response.ok) {
      setMessage("Unable to load your books.");
      return;
    }

    const data = await response.json();
    setBooks(data.books);
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        const authenticated = await fetchUser();

        if (!authenticated) {
          return;
        }

        await fetchBooks();
      } catch (error) {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, []);

  const clearForm = () => {
    setTitle("");
    setAuthor("");
    setGenre("");
    setEditingBookId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setSubmitting(true);

    try {
      const endpoint = editingBookId
        ? `/api/books/${editingBookId}`
        : "/api/books";

      const response = await apiFetch(endpoint, {
        method: editingBookId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          genre,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      if (editingBookId) {
        setBooks((currentBooks) =>
          currentBooks.map((book) =>
            book._id === editingBookId ? data.book : book,
          ),
        );
      } else {
        setBooks((currentBooks) => [data.book, ...currentBooks]);
      }

      clearForm();
      setMessage(
        editingBookId
          ? "Book updated successfully."
          : "Book added successfully.",
      );
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (book: Book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setEditingBookId(book._id);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    setMessage("");

    const response = await apiFetch(`/api/books/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setBooks((currentBooks) => currentBooks.filter((book) => book._id !== id));

    setMessage("Book deleted successfully.");
  };

  const handleLogout = async () => {
    await apiFetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f1e8] text-[#25221e]">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8b5e3c]">
          Loading your library...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#25221e]">
      <header className="border-b border-[#25221e]/10 bg-[#f5f1e8]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <Link href="/books" className="text-xl font-bold tracking-tight">
            Book<span className="text-[#8b5e3c]">Collection</span>
          </Link>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-[#777066]">{user.email}</p>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="rounded-full border border-[#25221e]/15 px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:bg-[#25221e] hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8b5e3c]">
            Your library
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {user ? `${user.name}'s collection` : "Your collection"}
          </h1>

          <p className="mt-3 max-w-xl text-[#777066]">
            Add, organize, update, and remove the books in your personal
            collection.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <section className="h-fit rounded-[2rem] border border-[#25221e]/10 bg-white p-7 shadow-[0_20px_60px_rgba(74,59,44,0.08)]">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b5e3c]">
                {editingBookId ? "Edit book" : "Add a book"}
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {editingBookId ? "Update your book" : "Build your collection"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold"
                >
                  Title
                </label>

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Book title"
                  required
                  className="w-full rounded-2xl border border-[#25221e]/10 bg-[#f8f5ef] px-4 py-3.5 outline-none transition-all duration-300 placeholder:text-[#aaa196] focus:border-[#8b5e3c] focus:bg-white focus:ring-4 focus:ring-[#8b5e3c]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="author"
                  className="mb-2 block text-sm font-semibold"
                >
                  Author
                </label>

                <input
                  id="author"
                  type="text"
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  placeholder="Author name"
                  required
                  className="w-full rounded-2xl border border-[#25221e]/10 bg-[#f8f5ef] px-4 py-3.5 outline-none transition-all duration-300 placeholder:text-[#aaa196] focus:border-[#8b5e3c] focus:bg-white focus:ring-4 focus:ring-[#8b5e3c]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="genre"
                  className="mb-2 block text-sm font-semibold"
                >
                  Genre
                </label>

                <input
                  id="genre"
                  type="text"
                  value={genre}
                  onChange={(event) => setGenre(event.target.value)}
                  placeholder="e.g. Fiction"
                  required
                  className="w-full rounded-2xl border border-[#25221e]/10 bg-[#f8f5ef] px-4 py-3.5 outline-none transition-all duration-300 placeholder:text-[#aaa196] focus:border-[#8b5e3c] focus:bg-white focus:ring-4 focus:ring-[#8b5e3c]/10"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-[#25221e] px-4 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-[#8b5e3c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Saving..."
                  : editingBookId
                    ? "Update Book"
                    : "Add Book"}
              </button>

              {editingBookId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="w-full rounded-2xl border border-[#25221e]/10 px-4 py-3.5 font-semibold transition-all duration-300 hover:bg-[#f5f1e8]"
                >
                  Cancel Edit
                </button>
              )}
            </form>

            {message && (
              <p className="mt-5 rounded-xl bg-[#f8f5ef] px-4 py-3 text-center text-sm text-[#8b5e3c]">
                {message}
              </p>
            )}
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-[#777066]">
                  {books.length} {books.length === 1 ? "book" : "books"} in your
                  collection
                </p>
              </div>
            </div>

            {books.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-[#25221e]/15 bg-white px-6 py-20 text-center">
                <p className="text-2xl font-bold">Your collection is empty.</p>

                <p className="mx-auto mt-3 max-w-md text-[#777066]">
                  Add your first book using the form and it will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {books.map((book) => (
                  <article
                    key={book._id}
                    className="group rounded-[2rem] border border-[#25221e]/10 bg-white p-6 shadow-[0_15px_45px_rgba(74,59,44,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(74,59,44,0.12)]"
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8dfd1] text-[#8b5e3c]">
                      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                        <path
                          d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v18H7.5A2.5 2.5 0 0 0 5 22V4.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 19.5A2.5 2.5 0 0 1 7.5 17H19"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b5e3c]">
                      {book.genre}
                    </p>

                    <h3 className="text-2xl font-bold leading-tight">
                      {book.title}
                    </h3>

                    <p className="mt-2 text-[#777066]">by {book.author}</p>

                    <div className="mt-7 flex gap-3">
                      <button
                        onClick={() => handleEdit(book)}
                        className="flex-1 rounded-xl border border-[#25221e]/10 px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:bg-[#25221e] hover:text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(book._id)}
                        className="flex-1 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all duration-300 hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
