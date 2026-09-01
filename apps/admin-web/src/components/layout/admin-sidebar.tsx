import {House,LayoutGrid, ShoppingBag, PackageSearch, FileText, Truck } from "lucide-react";


import { Sidebar, SidebarContent, 
    SidebarHeader, SidebarFooter,
    SidebarMenu, SidebarMenuItem, 
    SidebarMenuButton, 
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent} from "../ui/sidebar"; 
import { NavLink, useLocation } from "react-router-dom";
import DeskCraftLogo from "@/assets/DeskCraft-logo-2.png"




const navItems = [
    {title: "Dashboard", url: "#", icon: House},
    {title: "Categories", url: "#", icon: LayoutGrid},
    {title: "Products", url: "#", icon: ShoppingBag},
    {title: "Inventory", url: "#", icon: PackageSearch},
    {title: "Orders", url: "#", icon: FileText},
    {title: "Shipping", url: "#", icon: Truck},
]


type AdminSidebarProps = {
    admin : {
        first_name: string | null;
        email: string;
    };
};



export function AdminSidebar({admin}: AdminSidebarProps) {

    const location = useLocation();

    const adminName = admin.first_name?.trim() || "Administrator"





    return(
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" tooltip="DeskCraft admin" render={<NavLink to="/dashboard" />}>
                            <img src={DeskCraftLogo} alt="" aria-hidden="true" className="size-8 shrink-0 rounded-md object-contain"  />
                            <span>DeskCraft Admin</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Management
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.url;
                                return(
                                    <SidebarMenuItem key={item.url}>
                                        <SidebarMenuButton
                                            isActive={isActive}
                                            tooltip={item.title}
                                            render={<NavLink to={item.url} />}
                                        >
                                            <item.icon aria-hidden="true" />
                                            <span>{item.title}</span>

                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="min-w-0 px-2 py-2 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-sm font-medium">
                        {adminName}
                    </p>
                    <p className="truncate text-xs text-sidebar-foreground/70">
                        {admin.email}
                    </p>

                </div>
                
            </SidebarFooter>
        </Sidebar>
    );
}