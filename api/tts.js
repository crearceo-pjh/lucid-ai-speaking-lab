export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, voice_id } = req.body;
    
    if (!text || !voice_id) {
      return res.status(400).json({ error: 'text and voice_id required' });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': 'sk_be4da5b706f84e28fafe7ee6a020b9d390ded2e5c08b3bee',
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.9,
            style: 0.6,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(200).send(Buffer.from(buffer));

  } catch (error) {
    console.error('TTS error:', error);
    return res.status(500).json({ error: error.message });
  }
}
