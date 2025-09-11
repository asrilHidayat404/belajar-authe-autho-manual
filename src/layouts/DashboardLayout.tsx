"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ReactNode } from 'react';
import { AppSidebar } from './dashboard/app-sidebar';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathName = usePathname(); // ✅ Ambil pathname dari Next.js

    function formatPathname(path: string) {
        const segments = path.split('/').filter((segment) => segment.length > 0);
        return segments.map(
            (segment) =>
                decodeURIComponent(segment)
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (char) => char.toUpperCase())
        );
    }

    function getHrefForIndex(index: number, path: string) {
        const segments = path.split('/').filter((segment) => segment.length > 0);
        return '/' + segments.slice(0, index + 1).join('/');
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {formatPathname(pathName).map((segment, index, arr) => (
                                    <BreadcrumbItem key={index}>
                                        {index < arr.length - 1 ? (
                                            <>
                                                <BreadcrumbLink href={getHrefForIndex(index, pathName)}>
                                                    {segment}
                                                </BreadcrumbLink>
                                                <BreadcrumbSeparator />
                                            </>
                                        ) : (
                                            <BreadcrumbPage>{segment}</BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
