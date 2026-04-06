import { Box, Typography } from '@mui/material';

const MessageBubble = ({ message, isSent }) => {

    const date = new Date(message.timestamp);
    const formattedTimestamp = date.toLocaleString('pt-BT', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })
    
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isSent ? 'flex-start' : 'flex-end',
        mb: 2, // spacing between messages
      }}
    >
      <Box
        sx={{
          maxWidth: '70%',
          minWidth: '30%',
          p: 1.7,
          borderRadius: 2,
          
          // Customizing corners to mimic the "tail"
          borderTopRightRadius: isSent ? 2 : 0,
          borderTopLeftRadius: isSent ? 0 : 2,
          backgroundColor: isSent ? '#dcf8c6' : '#ffffff',
          boxShadow: 2,
        }}
      >
        <Typography variant="h6">{message.username}</Typography>
        <Typography sx={{ wordWrap: 'break-word' }} variant="body2">
          {message.content}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: 'text.secondary' }}
        >
          {formattedTimestamp}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;
