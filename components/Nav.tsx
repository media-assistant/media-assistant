import { HomeIcon, SearchIcon } from "@heroicons/react/solid";
import Link from "next/link";

const Nav = () => (
  <nav className="fixed inset-0 top-auto flex items-center justify-center">
    <Link href="/">
      <a className="flex flex-auto flex-col items-center justify-center">
        <HomeIcon className="h-6 w-6" /> Home
      </a>
    </Link>
    <Link href="/search">
      <a className="flex flex-auto flex-col items-center justify-center">
        <SearchIcon className="h-6 w-6" />
        Search
      </a>
    </Link>
  </nav>
);

export default Nav;
