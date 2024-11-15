import { IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

interface VoiceAssistantIconProps {
  onActivate: () => void; // Explicitly specify the type
}

function VoiceAssistantIcon({ onActivate }: VoiceAssistantIconProps) {
  return (
    <IconButton onClick={onActivate} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
      <MicIcon style={{ fontSize: 50, color: '#0078d4' }} />
    </IconButton>
  );
}

export default VoiceAssistantIcon;
