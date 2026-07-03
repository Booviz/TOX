"use client";

import { Bell, Search } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Card } from "./components/Card";

export default function Header() {
  const { data: session } = useSession();

  return (
    <Card className="v3-header">
      <div>
        <p>Workspace</p>
        <h2>
          Welcome back, {session?.user?.name || "Guest"} 👋
        </h2>
      </div>

      <div className="v3-header-actions">
        <div className="v3-search">
          <Search size={17} />
          <span>Search anything...</span>
        </div>

        <button className="v3-icon-button">
          <Bell size={18} />
        </button>

        {session?.user ? (
          <>
            {session.user.image && (
              <img
                src={session.user.image}
                alt="User Avatar"
                className="v3-user-avatar"
              />
            )}

            <button
              className="v3-primary-button"
              onClick={() => signOut()}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="v3-primary-button"
            onClick={() => signIn("discord")}
          >
            Login
          </button>
        )}
      </div>
    </Card>
  );
}