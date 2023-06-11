'use client';

// Reacts
import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Hooks
import { useUser } from "@/context/SessionContext";
import { useAuth } from "@/hooks";

// Components
import { Dropdown, DropdownItem } from "@/components";

// Icons
import { TbUser } from "react-icons/tb";

// Dark Mode
import DarkModeSwitch from "./DarkModeSwitch";


const UserDropdown: FC = () => {

    // Hooks
    //
    const router = useRouter();
    const { logout } = useAuth();
    const { user, isLoading } = useUser();

    // Handle logout
    const onLogout = () => {
        logout();
        router.push('/login');
    }

    return (
        <div className="relative dropdown">
            <button type="button" className="overflow-hidden w-12 h-12 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-black">
                <TbUser size={24} strokeWidth={1} />
            </button>

            <Dropdown variant='right' className={`dropdown-menu pt-14`}>
                <div className="mb-1 py-2 px-4 flex flex-col border-b border-neutral-200 dark:border-neutral-900 cursor-default">

                    {!isLoading &&
                        <>
                            {user?.name &&
                                <span className="text-neutral-800 dark:text-white font-bold line-clamp-1">{user?.name}</span>
                            }
                            <span className="text-sm text-neutral-500 line-clamp-1">{user?.email}</span>
                        </>
                    }
                </div>

                <DropdownItem>
                    <DarkModeSwitch />
                </DropdownItem>

                <DropdownItem>
                    <Link href="/workspace/settings/notebooks" className="block py-2 px-4">Settings</Link>
                </DropdownItem>

                <DropdownItem>
                    <button onClick={onLogout} className="w-full py-2 px-4 text-left">
                        Log Out
                    </button>
                </DropdownItem>

            </Dropdown>
        </div>
    );
}

export default UserDropdown;