import React, { useState } from 'react';
import Textarea from '@mui/joy/Textarea';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import { Send, HeadphonesOutlined } from '@mui/icons-material/';
import useSound from 'use-sound';
import Typography from '@mui/material/Typography';

function App() {
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState('');
  const [query, setQuery] = useState('');
  const [audio, setAudio] = useState('');
  const [play] = useSound(audio);


  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  }

  const generateStory = () => {
    setLoading(true);
    console.log('story about: ', query);

    fetch(`http://127.0.0.1:8000/chat/chatgpt/${query}`, {
      method: 'GET',  
      headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed');
        }
      })
      .then(data => {
        console.log('story: ', data);
        if (data) {
          setStory(data);
        }
      })
      .catch(err => {
          console.log(err);
      });
      
    setLoading(false);
  }

  const generateAudio = () => {
    setLoading(true);
    console.log('audio about: ', story);

    fetch(`http://127.0.0.1:8000/voice/${story}`, {
      method: 'GET',  
      headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed');
        }
      })
      .then(data => {
        console.log('audio path: ', data);
        if (data) {
          setAudio(data);
        }
      })
      .catch(err => {
          console.log(err);
      });

    setLoading(false);
    
  }


  const handleSubmit = (e) => {

    e.preventDefault();
    generateStory();

  }


  return (
    <Box sx={{ marginTop: '32px', marginBottom: '32px', display: 'flex', flexWrap: 'wrap', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '100vh'}}>
      <Typography variant="h5" component="h5">
        ElevenLabs Tutorial: Create stories with Voice AI from ElevenLabs
      </Typography>
        <Box sx={{ marginTop: '32px', width: '600px' }}>
          <form
              onSubmit={handleSubmit}>
              <Textarea 
                sx={{ width: '100%' }}
                onChange={handleQueryChange}
                minRows={2} 
                maxRows={4} 
                placeholder="Type anything…" />
              <Button 
                disabled={loading || query === ''}
                type='submit'
                sx={{ marginTop: '16px' }}
                loading={loading}>
                  <Send />
              </Button>
          </form>
        </Box>
        {story && (
          <Box sx={{ marginTop: '32px', width: '600px' }}>
            <Textarea 
              sx={{ width: '100%' }}
              value={story}/>
              <Button
                loading={loading}
                sx={{ marginTop: '16px' }}
                onClick={audio ? play : generateAudio}>
                <HeadphonesOutlined />
              </Button>
          </Box>
        )}
    </Box>
  );
}

export default App;
