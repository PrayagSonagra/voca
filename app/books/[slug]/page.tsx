import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBookBySlug } from "@/lib/actions/book.actions";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import VapiControls from "@/components/VapiControls";

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect("/");
  }

  const book = result.data;

  return (
    <div className="book-page-container">
      {/* Floating Back Button */}
      <Link href="/" className="back-btn-floating">
        <ArrowLeft className="w-5 h-5 text-[#212a3b]" />
      </Link>

      <div className="vapi-main-container">
        <VapiControls book={book} />
      </div>
    </div>
  );
}
