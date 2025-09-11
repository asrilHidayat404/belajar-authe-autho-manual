import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';
import ThemeToggle from '@/utils/ThemeToggle';

export function NavSecondary({ ...props }) {
    return (
        <SidebarGroup {...props}>
            <SidebarGroupLabel>Appearance</SidebarGroupLabel>
            <SidebarMenu>
                <ThemeToggle />
            </SidebarMenu>
        </SidebarGroup>
    );
}
