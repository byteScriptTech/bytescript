'use client';

import { Play, Pause, RotateCcw } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TimerProps = {
  onTimeUp?: () => void;
  className?: string;
};

export function Timer({ onTimeUp, className = '' }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [customTime, setCustomTime] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const presets = [
    { label: '5 min', value: 5 * 60 },
    { label: '10 min', value: 10 * 60 },
    { label: '15 min', value: 15 * 60 },
    { label: '30 min', value: 30 * 60 },
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      onTimeUp?.();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, onTimeUp]);

  const startTimer = useCallback((seconds: number) => {
    setTimeLeft(seconds);
    setIsRunning(true);
  }, []);

  const toggleTimer = useCallback(() => {
    if (timeLeft > 0) {
      setIsRunning(!isRunning);
    }
  }, [isRunning, timeLeft]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(0);
    setSelectedPreset('');
  }, []);

  const handlePresetSelect = (value: string) => {
    const preset = presets.find((p) => p.label === value);
    if (preset) {
      setSelectedPreset(value);
      startTimer(preset.value);
    }
  };

  const handleCustomTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(customTime, 10);
    if (!isNaN(minutes) && minutes > 0) {
      startTimer(minutes * 60);
      setCustomTime('');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTimer}
          disabled={timeLeft === 0}
          className="h-8 w-8 p-0"
        >
          {isRunning ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetTimer}
          className="h-8 w-8 p-0"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm font-mono w-20 text-center">
        {timeLeft > 0 ? formatTime(timeLeft) : '00:00'}
      </div>

      <div className="flex items-center space-x-2">
        <Select onValueChange={handlePresetSelect} value={selectedPreset}>
          <SelectTrigger className="h-8 w-24">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            {presets.map((preset) => (
              <SelectItem key={preset.label} value={preset.label}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <form onSubmit={handleCustomTimeSubmit} className="flex space-x-1">
          <Input
            type="number"
            placeholder="Min"
            min="1"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            className="h-8 w-16 text-sm"
          />
          <Button type="submit" size="sm" className="h-8">
            Set
          </Button>
        </form>
      </div>
    </div>
  );
}
