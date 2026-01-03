import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { updateSettings } from '@/store/slices/timerSlice';
import type { RootState } from '@/store/store';

interface TimerSettings {
  getTimerEnabled: (topicId: string) => boolean;
  toggleTimer: (topicId: string) => void;
}

const TIMER_SETTINGS_KEY = 'practice-timer-settings';

export const useTimerSettings = (): TimerSettings => {
  const dispatch = useDispatch();
  const timerSettings = useSelector(
    (state: RootState) => state.timer?.settings || {}
  );

  const getTimerEnabled = (topicId: string): boolean => {
    return timerSettings[topicId] ?? true; // Default to true for new topics
  };

  const toggleTimer = (topicId: string) => {
    const currentValue = timerSettings[topicId] ?? true;
    const newValue = !currentValue;

    const newSettings = {
      ...timerSettings,
      [topicId]: newValue,
    };

    // Dispatch action to update Redux store
    dispatch(updateSettings(newSettings));

    // Also save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem(TIMER_SETTINGS_KEY, JSON.stringify(newSettings));
    }
  };

  // Load timer settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(TIMER_SETTINGS_KEY);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          dispatch(updateSettings(settings));
        } catch (error) {
          console.error('Error loading timer settings:', error);
        }
      }
    }
  }, [dispatch]);

  return {
    getTimerEnabled,
    toggleTimer,
  };
};

export default useTimerSettings;
