"use client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface MenuItem {
    label: string;
    path?: string;
    icon?: React.ComponentType<{ className?: string }>;
    roles?: string[];
    subItems?: SubMenuItem[];
}

interface SubMenuItem extends Omit<MenuItem, 'subItems'> {
    icon?: React.ComponentType<{ className?: string }>;
}

interface AuthUserType {
    user?: {
        role?: {
            role_name?: string;
        };
    };
}

export function NavMain({
    items,
    groupLabel = "Platform",
}: {
    items: MenuItem[];
    groupLabel?: string;
}) {
    const [auth, setAuth] = useState<AuthUserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const fetchAuthUser = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/authUser");
                if (!response.ok) throw new Error("Failed to fetch user data");
                const authUser = await response.json();
                setAuth(authUser);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };
        fetchAuthUser();
    }, []);

    const role = auth?.user?.role?.role_name;

    const normalizePath = (path?: string) => path ? path.replace(/\/+$/, '') : '';

    const isActive = (path?: string) => {
        const currentPath = normalizePath(pathname);
        const targetPath = normalizePath(path);

        if (!targetPath) return false;

        return currentPath === targetPath ||
            currentPath.startsWith(`${targetPath}/`);
    };

    const filteredItems = useMemo(() => {
        return items
            .filter((item) => {
                const allowedRoles = item.roles || [];
                return allowedRoles.length === 0 || allowedRoles.includes(role);
            })
            .map((item) => ({
                ...item,
                subItems: item.subItems?.filter((sub) => {
                    const allowedRoles = sub.roles || [];
                    return allowedRoles.length === 0 || allowedRoles.includes(role);
                }),
            }));
    }, [items, role]);



    if (loading) return <div className="p-4 text-sm">Loading navigation...</div>;
    if (error) return <div className="p-4 text-sm text-red-500">Error loading navigation: {error}</div>;

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
            <SidebarMenu>
                {filteredItems.map((item) => {


                    return (
                        <Collapsible
                            key={item.label}
                            asChild
                            defaultOpen={
                                (item.path && pathname.startsWith(item.path)) ||
                                item.subItems?.some((subItem) => pathname.startsWith(subItem.path))
                            }
                        >
                            <SidebarMenuItem>
                                <div className="flex w-full items-center">
                                    {item.subItems ? (
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={item.label}
                                                className={`w-full justify-start ${((pathname == item.path) && !item.subItems) ? 'bg-accent text-primary rounded-md' : ''}`}
                                            >
                                                <div className="flex items-center gap-2 w-full">
                                                    {item.icon}
                                                    <span className="flex-1 text-left">{item.label}</span>
                                                    <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </div>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                    ) : (
                                        <Link
                                            href={item.path || "#"}
                                            className={`w-full ${pathname == item.path ? 'bg-accent text-primary' : ''}`}
                                            passHref
                                        >
                                            <SidebarMenuButton
                                                tooltip={item.label}
                                                className="w-full justify-start"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {item.icon}
                                                    <span>{item.label}</span>
                                                </div>
                                            </SidebarMenuButton>
                                        </Link>
                                    )}
                                </div>

                                {item.subItems?.length && (
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.subItems.map((subItem) => {
                                                return (
                                                    <SidebarMenuSubItem key={subItem.label}>
                                                        <Link
                                                            href={subItem.path || "#"}
                                                            className={`w-full block ${pathname == subItem.path ? 'bg-accent text-primary rounded-md' : ''}`}
                                                            passHref
                                                        >
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                className="w-full justify-start"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    {subItem.icon}
                                                                    <span>{subItem.label}</span>
                                                                </div>
                                                            </SidebarMenuSubButton>
                                                        </Link>
                                                    </SidebarMenuSubItem>
                                                );
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}