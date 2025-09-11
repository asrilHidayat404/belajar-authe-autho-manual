import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Activity, ChevronRight } from 'lucide-react';

export function NavProjects({ ...props }) {
    const admin = "Admin";
    if (!admin) {
        return
    }
    return (
        <SidebarGroup {...props}>
            <SidebarGroupLabel>Log</SidebarGroupLabel>
            <SidebarMenu>
                <Collapsible
                    asChild
                    defaultOpen={true}
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                                <Activity />
                                <span>Log Activity</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                    </SidebarMenuItem>
                </Collapsible>
            </SidebarMenu>
        </SidebarGroup>
    );
}
