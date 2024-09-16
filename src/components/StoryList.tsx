// src/components/StoryList.tsx
import React from 'react';
import { Story } from '../types/Story';

interface StoryListProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

const StoryList: React.FC<StoryListProps> = ({ stories, onSelectStory }) => (
  <div className="min-h-screen bg-minecraftGreen text-white p-6">
    <h1 className="text-4xl font-minecraft text-center mb-8">Select Your Story</h1>
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {stories.map((story) => (
        <li
          key={story.id}
          className="cursor-pointer bg-minecraftBrown hover:bg-green-700 p-4 rounded-lg shadow-xl transform hover:scale-105 transition-transform"
          onClick={() => onSelectStory(story)}
        >
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h2 className="text-2xl font-minecraft text-center">{story.title}</h2>
        </li>
      ))}
    </ul>
  </div>
);

export default StoryList;
