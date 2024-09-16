// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Story } from './types/Story';
import StoryList from './components/StoryList';
import StoryViewer from './components/StoryViewer';
import { storage } from './firebaseConfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import 'pdfjs-dist/web/pdf_viewer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const App: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      const storiesRef = ref(storage, 'stories');
      const storyItems = await listAll(storiesRef);
      const storiesData: Story[] = await Promise.all(
        storyItems.items.map(async (item) => {
          const pdfUrl = await getDownloadURL(item);

          // Fetch the corresponding audio file (if exists)
          const audioRef = ref(storage, `audio/${item.name.replace('.pdf', '.mp3')}`);
          let audioUrl;
          try {
            audioUrl = await getDownloadURL(audioRef);
          } catch {
            audioUrl = undefined;
          }

          // Try fetching the image in both .jpg and .png formats
          const imageJpgRef = ref(storage, `images/${item.name.replace('.pdf', '.jpg')}`);
          const imagePngRef = ref(storage, `images/${item.name.replace('.pdf', '.png')}`);
          let imageUrl = '';

          try {
            imageUrl = await getDownloadURL(imagePngRef); // Fallback to .png if .jpg fails
          } catch {
            try {
              imageUrl = await getDownloadURL(imageJpgRef); // Try fetching .jpg first
            } catch {
              imageUrl = ''; // If no image found, set imageUrl to an empty string
            }
          }

          return {
            id: item.name,
            title: item.name.replace('.pdf', ''),
            description: '',
            pdfUrl,
            audioUrl,
            imageUrl,
          };
        })
      );
      setStories(storiesData);
    };

    fetchStories();
  }, []);

  return (
    <div>
      {selectedStory ? (
        <StoryViewer story={selectedStory} onBack={() => setSelectedStory(null)} />
      ) : (
        <StoryList stories={stories} onSelectStory={setSelectedStory} />
      )}
    </div>
  );
};

export default App;
