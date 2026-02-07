import { Camera, MapPin, Calendar, Store, Settings, User} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import ProfileTab from '../../components/userProfile/tabs/ProfileTab';
import ActivityTab from '../../components/userProfile/tabs/ActivityTab';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-black max-w-full">
      <div className="relative h-48 w-full bg-gradient-to-r from-green-100 via-green-300 to-green-500">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
      </div>

      <main className="container-fluid px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="relative -mt-24 mb-8">
            <Card className="p-6 border-none shadow-xl bg-white/80 dark:bg-card/80 backdrop-blur-md">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6">

                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage src={user?.avatar ?? ''} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold">
                      {initials || <User />}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-2 right-2 p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all scale-0 group-hover:scale-100">
                    <Camera className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 text-center md:text-left space-y-2 pb-2">
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                      {user?.name}
                    </h1>
                    {user?.stores?.[0]?.is_verified && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-none px-3 py-1">
                        <Store className="h-3.5 w-3.5 mr-1" />
                        Verified Seller
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-muted-foreground text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {user?.location || "Global"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> Joined {new Date().getFullYear()}
                    </span>
                  </div>
                </div>

              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <nav className="flex flex-col gap-1">
                {[
                  { id: 'profile', label: 'Overview', icon: User },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 text-white'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground dark:text-white'
                      }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="lg:col-span-3">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 dark:text-white bg:dark">
                {activeTab === "profile" && <ProfileTab />}
                {activeTab === "activity" && <ActivityTab />}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;