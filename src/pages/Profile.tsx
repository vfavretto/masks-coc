import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, Crown, Skull, Edit3, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileAPI, UserProfile } from '@/services/userApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Profile = () => {
  const { user, isKeeper } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await ProfileAPI.getMyProfile();
      setProfile(data);
      setDisplayName(data.displayName || '');
      setBio(data.bio || '');
      setAvatar(data.avatar || '');
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const updated = await ProfileAPI.updateProfile({
        displayName: displayName || undefined,
        bio: bio || undefined,
        avatar: avatar || undefined,
      });
      setProfile(updated);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(profile?.displayName || '');
    setBio(profile?.bio || '');
    setAvatar(profile?.avatar || '');
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-[MedievalSharp] text-primary mb-2">Investigator Profile</h1>
        <p className="text-muted-foreground font-serif italic">
          "Know thyself, before the cosmos knows you."
        </p>
      </div>

      {/* Profile Card */}
      <Card className="bg-black/60 border-primary/30 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  isKeeper ? <Crown className="w-10 h-10 text-primary" /> : <Skull className="w-10 h-10 text-primary" />
                )}
              </div>
              <Badge 
                variant={isKeeper ? 'default' : 'secondary'} 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px]"
              >
                {profile.role}
              </Badge>
            </div>
            <div>
              <h2 className="text-2xl font-[MedievalSharp] text-primary">
                {profile.displayName || profile.username}
              </h2>
              <p className="text-muted-foreground text-sm">@{profile.username}</p>
            </div>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
              <Edit3 className="w-4 h-4" />
              Edit
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Display Name
            </label>
            {isEditing ? (
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should others call you?"
                className="bg-black/50 border-primary/30"
                maxLength={100}
              />
            ) : (
              <p className="text-foreground font-serif">
                {profile.displayName || <span className="text-muted-foreground italic">Not set</span>}
              </p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Email
            </label>
            <p className="text-foreground font-serif">{profile.email}</p>
          </div>

          {/* Avatar URL */}
          {isEditing && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Avatar URL
              </label>
              <Input
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/your-avatar.jpg"
                className="bg-black/50 border-primary/30"
              />
            </div>
          )}

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Bio
            </label>
            {isEditing ? (
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about your investigator..."
                className="bg-black/50 border-primary/30 min-h-[100px]"
                maxLength={500}
              />
            ) : (
              <p className="text-foreground font-serif whitespace-pre-wrap">
                {profile.bio || <span className="text-muted-foreground italic">No bio yet</span>}
              </p>
            )}
          </div>

          {/* Actions */}
          {isEditing && (
            <div className="flex gap-3 pt-4 border-t border-primary/10">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex-1 gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="bg-black/40 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg font-[MedievalSharp] text-primary">Account Info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Role</p>
            <p className="text-foreground font-serif capitalize">{profile.role}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Username</p>
            <p className="text-foreground font-serif">{profile.username}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
