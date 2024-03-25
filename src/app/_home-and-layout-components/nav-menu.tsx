// LIBS
import Link from "next/link";

// COMPONENTS
import ProtectedContent from "~/components/protectedContent";
import { Button } from "~/components/ui/button";
import LoginBtn from "./login-btn";

// TYPES
import { type UserRole } from "~/server/db/schema";

type NavItems = {
  title: string;
  href: string;
  authedRoles?: UserRole[] | undefined;
}[];

// Nav items
const navItems: NavItems = [
  { title: "Tasks", href: "/" },
  { title: "Users", href: "/users", authedRoles: ["ADMIN"] },
];

const NavMenu = () => {
  return (
    <div
      // Nav Menu
      className="flex items-center justify-start gap-6"
    >
      {navItems.map((item) => {
        return (
          <ProtectedContent
            key={`navbar-${item.title}`}
            authedRoles={item?.authedRoles}
          >
            <Link href={item.href} tabIndex={-1}>
              <Button variant={"ghost"} className="text-primary-foreground">
                {item.title}
              </Button>
            </Link>
          </ProtectedContent>
        );
      })}
      <ProtectedContent
        authedRoles={["ADMIN", "USER", "RESTRICTED"]}
        fallback={<LoginBtn />}
      >
        <Link href="account" tabIndex={-1}>
          <Button variant={"ghost"} className="text-primary-foreground">
            My Account
          </Button>
        </Link>
      </ProtectedContent>
    </div>
  );
};
export default NavMenu;
