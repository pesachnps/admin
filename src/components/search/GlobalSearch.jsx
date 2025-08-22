
import React, { useState, useEffect } from 'react';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import { LayoutDashboard, Palette, Monitor, Users, Settings, Search, Activity } from 'lucide-react'; // Added Activity import
import { useNavigate } from 'react-router-dom';

const pages = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'ActivityLog', label: 'Activity Log', icon: Activity }, // Added Activity Log page
  { name: 'ThemeSettings', label: 'Theme Settings', icon: Palette },
  { name: 'DisplaySettings', label: 'Display Settings', icon: Monitor },
  { name: 'UserManagement', label: 'User Management', icon: Users },
  { name: 'SystemSettings', label: 'System Settings', icon: Settings },
];

export default function GlobalSearch({ open, setOpen }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await User.list();
        setUsers(userList);
      } catch (error) {
        console.error("Failed to load users for search:", error);
      }
    };
    if (open) {
      loadUsers();
    }
  }, [open]);
  
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [setOpen])


  const handleSelect = (url) => {
    navigate(url);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem key={page.name} onSelect={() => handleSelect(createPageUrl(page.name))}>
              <page.icon className="mr-2 h-4 w-4" />
              <span>{page.label || page.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Users">
          {users.map((user) => (
            <CommandItem key={user.id} onSelect={() => handleSelect(createPageUrl(`UserManagement?userId=${user.id}`))}>
              <Users className="mr-2 h-4 w-4" />
              <span>{user.full_name || 'Unknown User'}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
