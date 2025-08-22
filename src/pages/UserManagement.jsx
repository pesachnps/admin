
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  Crown,
  Shield,
  User as UserIcon,
  Mail,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import UserCardSkeleton from "../components/users/UserCardSkeleton";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const userData = await User.list();
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
    setIsLoading(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4" />;
      case 'user': return <UserIcon className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'user': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent mb-2">
              User Management
            </h1>
            <p className="text-muted-foreground text-lg">Manage user accounts, roles, and permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-2">
              {users.length} Total Users
            </Badge>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border text-foreground placeholder-muted-foreground"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterRole === "all" ? "default" : "outline"}
                    onClick={() => setFilterRole("all")}
                    className={filterRole === "all" ? "bg-indigo-600 hover:bg-indigo-700 text-primary-foreground" : "border-border text-muted-foreground"}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterRole === "admin" ? "default" : "outline"}
                    onClick={() => setFilterRole("admin")}
                    className={filterRole === "admin" ? "bg-indigo-600 hover:bg-indigo-700 text-primary-foreground" : "border-border text-muted-foreground"}
                  >
                    <Crown className="w-4 h-4 mr-1" />
                    Admins
                  </Button>
                  <Button
                    variant={filterRole === "user" ? "default" : "outline"}
                    onClick={() => setFilterRole("user")}
                    className={filterRole === "user" ? "bg-indigo-600 hover:bg-indigo-700 text-primary-foreground" : "border-border text-muted-foreground"}
                  >
                    <UserIcon className="w-4 h-4 mr-1" />
                    Users
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading 
            ? Array.from({ length: 6 }).map((_, i) => <UserCardSkeleton key={i} />)
            : filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="bg-card/30 border-border/50 backdrop-blur-xl hover:bg-card/40 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-primary-foreground font-semibold">
                            {user.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-indigo-200 transition-colors">
                            {user.full_name || 'Unknown User'}
                          </h3>
                          <Badge className={`${getRoleColor(user.role)} border text-xs mt-1`}>
                            {getRoleIcon(user.role)}
                            <span className="ml-1 capitalize">{user.role}</span>
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {formatDate(user.created_date)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-muted-foreground">Active</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-muted-foreground hover:text-foreground"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
          ))}
        </motion.div>

        {!isLoading && filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No users found</h3>
            <p className="text-muted-foreground/80">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
