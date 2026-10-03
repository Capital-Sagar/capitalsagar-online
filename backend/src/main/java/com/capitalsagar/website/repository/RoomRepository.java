package com.capitalsagar.website.repository;

import com.capitalsagar.website.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
}