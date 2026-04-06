import { TextField, Button, List, ListItem, Typography, ListItemAvatar } from '@mui/material';

function messageInBox({ name, content, timestamp }) {
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                    <Avatar {...stringAvatar(name)} />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={name} secondary={content} />
        </ListItem>
    )
}