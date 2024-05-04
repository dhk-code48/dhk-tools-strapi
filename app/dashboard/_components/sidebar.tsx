import { Package2Icon } from "lucide-react";
import { SidebarRoutes } from "./sidebar-routes";
import Link from "next/link";
import { FC } from "react";

export const Sidebar: FC = () => {
  return (
    <div className="w-[250px] border-r bg-gray-100/40 fixed h-screen dark:bg-gray-800/40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="#">
            <Package2Icon className="h-6 w-6" />
            <p>Swarnim Publication</p>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <SidebarRoutes />
          </nav>
        </div>
        {/* <div className="mt-auto p-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>Unlock all features and get unlimited access to our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="sm">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div> */}
      </div>
    </div>
  );
};
