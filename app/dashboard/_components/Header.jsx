"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Questions", href: "/dashboard/questions" },
  { label: "Upgrade", href: "/dashboard/upgrade" },
  { label: "How it Works?", href: "/dashboard/howitworks" },
];

const Header = () => {
  const path = usePathname();

  return (
    <header className="flex py-4 px-5 md:px-8 items-center justify-between bg-secondary shadow-sm">
      <Link href="/dashboard" className="flex items-center">
        <Image
          src="/logo.svg"
          width={30}
          height={30}
          alt="AI Interview Mocker"
          className="mr-3 w-8"
        />
        <span className="font-semibold text-lg">AI Interview Mocker</span>
      </Link>

      <nav className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-all hover:text-primary hover:underline ${
              path === item.href
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}

        <div className="ml-4">
          <UserButton />
        </div>
      </nav>
    </header>
  );
};

export default Header;
