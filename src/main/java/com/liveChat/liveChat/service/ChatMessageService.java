package com.liveChat.liveChat.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.liveChat.liveChat.models.ChatMessageEntity;
import com.liveChat.liveChat.repository.ChatMessageRepository;

@Service
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatMessageService(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    public void saveMessage(String content, String username){
        var messageEntity = new ChatMessageEntity();

        messageEntity.setContent(content);
        messageEntity.setUsername(username);
        chatMessageRepository.save(messageEntity);
    }

    public List<ChatMessageEntity> getMessageEntitiesByUser(String username) {
        return chatMessageRepository.findByUsername(username);
    }

    public List<ChatMessageEntity> getAllMessages() {
        return chatMessageRepository.findAll();
    }
    
    public List<ChatMessageEntity> getMessagesLast10() {
        return chatMessageRepository.findTop10ByOrderByTimestampDesc();
    }
}
