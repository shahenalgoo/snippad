'use client';

// Reacts
import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, Dropdown, DropdownItem } from "@/components";
import { useUser } from "@/context/SessionContext";
import { useAuth, useToggle } from "@/hooks";
import { TbUser } from "react-icons/tb";

interface UserDropdownProps {

}

const UserDropdown: FC<UserDropdownProps> = () => {

    const router = useRouter();
    const { user, isLoading } = useUser();
    const { logout } = useAuth();

    const [dropdownActive, setDropdownActive] = useToggle();

    const onLogout = () => {
        logout();
        setDropdownActive(!dropdownActive);
        router.push('/login');
    }

    return (
        <>
            <div className="relative">
                <button onClick={() => setDropdownActive(!dropdownActive)} className="overflow-hidden w-12 h-12 rounded-full flex items-center justify-center bg-primary shadow-md">
                    <TbUser size={26} strokeWidth={1} />
                </button>

                <Dropdown variant='right' className={dropdownActive ? 'block' : 'hidden'}>
                    <div className="mb-1 py-2 px-4 flex flex-col border-b border-neutral-200 cursor-default">

                        {!isLoading &&
                            <>
                                {user?.name &&
                                    <span className="text-neutral-800 font-bold line-clamp-1">{user?.name}</span>
                                }
                                <span className="text-sm text-neutral-500 line-clamp-1">{user?.email}</span>
                            </>
                        }
                    </div>

                    <DropdownItem>
                        <Link onClick={() => setDropdownActive(!dropdownActive)} href="/workspace/settings" className="block py-2 px-4">Settings</Link>
                    </DropdownItem>

                    <DropdownItem>
                        <button onClick={onLogout} className="w-full py-2 px-4 text-left">
                            Log Out
                        </button>
                    </DropdownItem>
                </Dropdown>
            </div>
        </>
    );
}

export default UserDropdown;