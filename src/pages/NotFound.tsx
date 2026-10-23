import { Link } from "@pwabucket/pwa-router";

import HeaderTitle from "../layouts/HeaderTitle";
import InnerAppLayout from "../layouts/InnerAppLayout";

export default function NotFound({
  title = "Page not found",
}: {
  title?: string;
}) {
  return (
    <InnerAppLayout
      headerMiddleContent={<HeaderTitle>{title}</HeaderTitle>}
      className="items-center justify-center gap-4 text-center"
    >
      <p className="text-neutral-300">
        This page doesn't exist or has moved.
      </p>
      <Link
        to="/"
        replace
        className="px-4 py-2 rounded-xl bg-yellow-500 text-black"
      >
        Go home
      </Link>
    </InnerAppLayout>
  );
}
