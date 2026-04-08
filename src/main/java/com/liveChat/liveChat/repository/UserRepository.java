package com.liveChat.liveChat.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.liveChat.liveChat.models.UserEntity;
//import java.util.List;


public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    @Query("SELECT u FROM UserEntity u WHERE u.username = :username")
    UserEntity findByUsername(String username);

}
