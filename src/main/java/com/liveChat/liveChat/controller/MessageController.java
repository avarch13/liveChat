package com.liveChat.liveChat.controller;

import com.liveChat.liveChat.models.ChatMessage;
import com.liveChat.liveChat.models.ChatMessageEntity;
import com.liveChat.liveChat.service.ChatMessageService;

import java.util.Date;
import java.util.List;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;





@RestController
@RequestMapping("api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {
    private final ChatMessageService chatMessageService;

    @MessageMapping("/chat")
    @SendTo("/topic/messages") // send the message to all clients sub to topic/public via broker
    public ChatMessageEntity sendMessage(@Payload ChatMessageEntity message) {
        message.setTimestamp(new Date().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
        saveMessage(message);
        
        //spring auto converts json to object (ChatMessage) so I don't need to manually parse
        return message;
    }

    public MessageController(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }
    @PostMapping
    public void saveMessage(@RequestBody ChatMessageEntity message) {
        chatMessageService.saveMessage(message.getContent(), message.getUsername());
    }

    @GetMapping("/{username}")
    public List<ChatMessageEntity> getMessagesByUser(@PathVariable String username) {
        return chatMessageService.getMessageEntitiesByUser(username).stream()
                .map(entity -> new ChatMessageEntity(entity.getContent(), entity.getUsername(), entity.getTimestamp()))
                .toList();
    }

    @GetMapping("/last10")
    public List<ChatMessageEntity> getMessagesLast10() {
        return chatMessageService.getMessagesLast10().stream()
                .map(entity -> new ChatMessageEntity(entity.getContent(), entity.getUsername(), entity.getTimestamp()))
                .toList();
    }
    
    
    


}
