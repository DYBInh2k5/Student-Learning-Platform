'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Star, Trophy, Zap, Users, Award } from 'lucide-react';

export default function AchievementsPage() {
  const { request } = useApi();
  const [unlockedAchievements, setUnlockedAchievements] = useState<any[]>([]);
  const [lockedAchievements, setLockedAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await request('/api/achievements/user/my-achievements');
        setUnlockedAchievements(response.unlocked || []);
        setLockedAchievements(response.locked || []);
      } catch (error: any) {
        console.error('Failed to fetch achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning':
        return <Trophy className="w-5 h-5" />;
      case 'social':
        return <Users className="w-5 h-5" />;
      case 'contribution':
        return <Award className="w-5 h-5" />;
      case 'milestone':
        return <Zap className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-400 bg-gray-50';
      case 'uncommon':
        return 'border-green-400 bg-green-50';
      case 'rare':
        return 'border-blue-400 bg-blue-50';
      case 'legendary':
        return 'border-purple-400 bg-purple-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Award className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Achievements</h1>
          <p className="text-gray-600">
            {unlockedAchievements.length} / {unlockedAchievements.length + lockedAchievements.length}{' '}
            unlocked
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading achievements...</p>
          </div>
        ) : (
          <>
            {/* Unlocked Achievements */}
            {unlockedAchievements.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Unlocked</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {unlockedAchievements.map((achievement: any) => (
                    <div
                      key={achievement._id}
                      className={`border-2 rounded-lg p-6 text-center transition hover:shadow-lg ${getRarityColor(
                        achievement.achievementId?.rarity
                      )}`}
                    >
                      <div className="text-5xl mb-3">{achievement.achievementId?.icon}</div>
                      <h3 className="font-bold text-gray-900 mb-2">{achievement.achievementId?.name}</h3>
                      <p className="text-xs text-gray-600 mb-3">{achievement.achievementId?.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Locked Achievements */}
            {lockedAchievements.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Locked</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {lockedAchievements.map((achievement: any) => (
                    <div
                      key={achievement._id}
                      className="border-2 border-gray-300 rounded-lg p-6 text-center opacity-50 bg-gray-50"
                    >
                      <div className="text-5xl mb-3 grayscale">🔒</div>
                      <h3 className="font-bold text-gray-700 mb-2">{achievement.name}</h3>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-3 italic">{achievement.condition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
