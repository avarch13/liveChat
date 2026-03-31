package com.liveChat.liveChat.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.liveChat.liveChat.models.ChatMessageEntity;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {

    List<ChatMessageEntity> findByUsername(String username);
}
