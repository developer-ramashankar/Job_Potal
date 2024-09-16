import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const [showsignIn, setShowsignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  useEffect(() => {
    if (search.get("sign-in")) setShowsignIn(true);
  }, [search]);

  const handleOverlayout = (e) => {
    if (e.target === e.currentTarget) setShowsignIn(false);
    setSearch({});
  };
  const { user } = useUser();
  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link>
          <img src="/logo2.png" alt="" className="h-36" />
        </Link>
    
        <div className="flex gap-4">
          <SignedOut>
            <Button variant="outline" onClick={() => setShowsignIn(true)}>
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} className="mr-2" /> Post a Job
                </Button>
              </Link>
            )}
            <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }}>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>
      {showsignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          onClick={handleOverlayout}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;
