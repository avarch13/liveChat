package com.liveChat.liveChat.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.liveChat.liveChat.models.ChatMessageEntity;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {

    @Query("SELECT c FROM ChatMessageEntity c WHERE c.username = :username")
    List<ChatMessageEntity> findByUsername(String username);

    List<ChatMessageEntity> findAll();

    @Query("SELECT c FROM ChatMessageEntity c ORDER BY c.timestamp desc LIMIT 10")
    List<ChatMessageEntity> findTop10ByOrderByTimestampDesc();
}
