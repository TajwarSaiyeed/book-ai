"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo.png";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs";

const navItems = [
  {
    label: "Library",
    href: "/",
  },
  {
    label: "Add New",
    href: "/books/new",
  },
];

export default function Navbar() {
  const pathName = usePathname();
  const { user } = useUser();
  return (
    <header className="w-full fixed z-50 bg-('bg-primary')">
      <div className="wrapper navbar-height py-4 flex justify-between items-center">
        <Link className="flex gap-0.5 items-center" href="/">
          <Image src={Logo} alt="Book AI Logo" width={42} height={24} className="rounded-sm" />
          <span className="logo-text">BookAi</span>
        </Link>

        <nav className="w-fit flex gap-7.5 items-center">
          {navItems.map(({ label, href }) => {
            const isActive = pathName === href || (href !== "/" && pathName?.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "nav-link-base",
                  isActive ? "nav-link-active" : "text-black hover:opacity-70"
                )}
              >
                {label}
              </Link>
            );
          })}

          <div className="flex items-center gap-7.5">
            <Show when="signed-out">
              <SignInButton />
            </Show>
            <Show when="signed-in">
              <div className="nav-user-link">
                <UserButton />
                {user?.firstName && (
                  <Link href="/subscriptions" className="nav-user-name">
                    {user.firstName}
                  </Link>
                )}
              </div>
            </Show>
          </div>
        </nav>
      </div>
    </header>
  );
}
