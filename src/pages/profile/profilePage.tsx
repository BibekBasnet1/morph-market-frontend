
import { Camera } from 'lucide-react';
import ProfileTabs from '../../components/userProfile/userProfileTabs';
import { useState } from 'react';
import ProfileTab from '../../components/userProfile/tabs/ProfileTab';
import SettingsTab from '../../components/userProfile/tabs/SettingsTab';
import ActivityTab from '../../components/userProfile/tabs/ActivityTab';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage = () => {
    const { user } = useAuth();
    console.log(user?.name);

 const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-background">
      {/* <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back to Marketplace</span>
            </Link>
          </div>
          <h1 className="font-serif text-xl font-semibold text-foreground">My Profile</h1>
          <div className="w-24" />
        </div>
      </header> */}

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="relative mb-8">
          <div className="h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-12 px-4 sm:px-8">
            <div className="relative group">
              {/* <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-background shadow-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-3xl font-serif bg-primary text-primary-foreground">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar> */}
              <button className="absolute bottom-1 right-1 p-2 rounded-full bg-primary text-primary-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left pb-2">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-1">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">{user?.name}</h2>
                {/* {user?.isSeller && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Store className="h-3 w-3" />
                    Verified Seller
                  </Badge>
                )} */}
              </div>
              {/* <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {user?.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {user?.joinedDate}
                </span>
                {user?.isSeller && (
                  <span className="flex items-center gap-1 text-secondary">
                    <Star className="h-4 w-4 fill-secondary" />
                    {user?.rating} rating
                  </span>
                )}
              </div> */}
            </div>

            {/* <Button className="hidden sm:flex">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button> */}
          </div>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow cursor-default">
              <CardContent className="pt-4 pb-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-2">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div> */}

        {/* Tabs Section */}
         <div className="space-y-6">
      <ProfileTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "profile" && <ProfileTab />}
      {activeTab === "settings" && <SettingsTab />}
      {activeTab === "activity" && <ActivityTab />}
    </div>

       
        {/* <div className="fixed bottom-6 left-0 right-0 px-4 sm:hidden">
          <Button className="w-full shadow-lg">
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div> */}
      </main>
    </div>
  );
};

export default ProfilePage;
