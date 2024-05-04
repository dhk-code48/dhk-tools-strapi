"use client";

import {
  Book,
  BookCheck,
  Grid,
  Layout,
  ReceiptText,
  Users,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { FC } from "react";

export const SidebarRoutes: FC = () => {
  const superAdminRoutes = [
    {
      icon: Layout,
      href: `/dashboard`,
      label: "Dashboard",
    },
    {
      icon: ReceiptText,
      href: `/dashboard/issueRecords`,
      label: "Issue Book",
    },
    {
      icon: BookCheck,
      href: `/dashboard/returnRecords`,
      label: "Return Record",
    },
    {
      icon: Book,
      href: `/dashboard/books`,
      label: "Books",
    },
    {
      icon: Grid,
      href: `/dashboard/categories`,
      label: "Categories",
    },
    {
      icon: Users,
      href: `/dashboard/members`,
      label: "Members",
    },
  ];

  // const pathname = usePathname();

  return (
    <div className="flex flex-col w-full gap-y-1">
      {superAdminRoutes.map((route) => (
        <SidebarItem
          href={route.href}
          icon={route.icon}
          label={route.label}
          key={route.label}
        />
      ))}
    </div>
  );
};
