// routesSidebar.ts
import {
    Grid, Users2, User, BookDown, Rocket, List, Dock, SortDesc,
    Activity, ListFilter, Image, Package, PieChart, Sun,
    Moon
} from "lucide-react";
import { RiOrganizationChart, RiGroup2Fill, RiMoneyCnyBoxLine } from "@remixicon/react";

export interface SidebarItem {
    label: string;
    path?: string;
    icon?: React.ReactNode;
    roles: string[];
    subItems?: SidebarItem[];
}

export const sidebarMenu: SidebarItem[] = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: <Grid size={18} />,
        roles: ["Admin", "Mahasiswa", "Reviewer", "Keuangan"],
    },
    {
        label: "Ormawa",
        icon: <RiOrganizationChart size={18} />,
        roles: ["Admin"],
        subItems: [
            { label: "BEM", path: "/dashboard/ormawa/badan-eksekutif-mahasiswa", icon: <Users2 size={18} />, roles: ["Admin"] },
            { label: "UKM", path: "/dashboard/ormawa/unit-kegiatan-mahasiswa", icon: <Users2 size={18} />, roles: ["Admin"] },
            { label: "HMP", path: "/dashboard/ormawa/himpunan-mahasiswa-prodi", icon: <Users2 size={18} />, roles: ["Admin"] },
            { label: "DPM", path: "/dashboard/ormawa/dewan-perwakilan-mahasiswa", icon: <Users2 size={18} />, roles: ["Admin"] },
        ],
    },
    {
        label: "User Management",
        icon: <User size={18} />,
        roles: ["Admin"],
        subItems: [
            { label: "All Users", path: "/dashboard/user-management", icon: <RiGroup2Fill size={18} />, roles: ["Admin"] },
            { label: "Reviewers", path: "/dashboard/user-management/reviewers", icon: <Users2 size={18} />, roles: ["Admin"] },
            { label: "Finances", path: "/dashboard/user-management/finances", icon: <RiMoneyCnyBoxLine size={18} />, roles: ["Admin"] },
            { label: "Collegents", path: "/dashboard/user-management/collegents", icon: <Users2 size={18} />, roles: ["Admin"] },
        ],
    },
    {
        label: "Proposals",
        icon: <BookDown size={18} />,
        roles: ["Admin"],
        subItems: [
            { label: "Proposal Assignment", path: "/dashboard/admin/proposals", icon: <Rocket size={18} />, roles: ["Admin"] },
            { label: "Proposal Lists", path: "/dashboard/admin/proposals-list", icon: <List size={18} />, roles: ["Admin"] },
            { label: "Category Management", path: "/dashboard/admin/category-management", icon: <Dock size={18} />, roles: ["Admin"] },
            { label: "Theme Management", path: "/dashboard/admin/theme-management", icon: <SortDesc size={18} />, roles: ["Admin"] },
        ],
    },
    {
        label: "Proposals (Mahasiswa)",
        icon: <BookDown size={18} />,
        roles: ["Mahasiswa"],
        subItems: [
            { label: "Proposal List", path: "/dashboard/proposals", icon: <List size={18} />, roles: ["Mahasiswa"] },
            { label: "Assign Proposal", path: "/dashboard/proposals/submit", icon: <Rocket size={18} />, roles: ["Mahasiswa"] },
        ],
    },
    {
        label: "Activities (Mahasiswa)",
        icon: <Activity size={18} />,
        roles: ["Mahasiswa"],
        subItems: [
            { label: "Activity List", path: "/dashboard/activity-list", icon: <ListFilter size={18} />, roles: ["Mahasiswa"] },
            { label: "Documentation", path: "/dashboard/documentation", icon: <Image size={18} />, roles: ["Mahasiswa"] },
        ],
    },
    {
        label: "Activities",
        icon: <Activity size={18} />,
        roles: ["Admin"],
        subItems: [
            { label: "Activity Lists", path: "/dashboard/activities", icon: <ListFilter size={18} />, roles: ["Admin"] },
            { label: "Documentation", path: "/dashboard/documentation", icon: <Image size={18} />, roles: ["Admin"] },
        ],
    },
    {
        label: "Review",
        path: "/dashboard/review/proposal",
        icon: <Package size={18} />,
        roles: ["Reviewer"],
    },
    {
        label: "Pencairan Dana",
        path: "/dashboard/pencairan-dana",
        icon: <PieChart size={18} />,
        roles: ["Keuangan"],
    },
];

export const settingItems: SidebarItem[] = [
    {
        label: "Theme",
        path: "#",
        icon: <Sun size={18} />,
        roles: ["Admin", "Mahasiswa", "Reviewer", "Keuangan"],
        subItems: [
            {
                label: "Toggle Theme",
                path: "#",
                icon: <Moon />,
                roles: ["Admin", "Mahasiswa", "Reviewer", "Keuangan"],
            }
        ]
    },
];
