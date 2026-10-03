package com.capitalsagar.website.controller;

import com.capitalsagar.website.model.Booking;
import com.capitalsagar.website.model.Room;
import com.capitalsagar.website.repository.BookingRepository;
import com.capitalsagar.website.repository.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public BookingController(
            BookingRepository bookingRepository,
            RoomRepository roomRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable Long userId) {
        return bookingRepository.findByUserIdOrderByIdDesc(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking createBooking(@RequestBody Booking booking) {

        if (booking.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        if (booking.getRoomId() == null) {
            throw new IllegalArgumentException("Room ID is required");
        }

        if (booking.getGuestName() == null || booking.getGuestName().isBlank()) {
            throw new IllegalArgumentException("Guest name is required");
        }

        if (booking.getGuestEmail() == null || booking.getGuestEmail().isBlank()) {
            throw new IllegalArgumentException("Guest email is required");
        }

        if (booking.getCheckInDate() == null || booking.getCheckOutDate() == null) {
            throw new IllegalArgumentException(
                    "Check-in and check-out dates are required"
            );
        }

        if (!booking.getCheckOutDate().isAfter(booking.getCheckInDate())) {
            throw new IllegalArgumentException(
                    "Check-out date must be after check-in date"
            );
        }

        Room room = roomRepository.findById(booking.getRoomId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Room not found")
                );

        if (!"available".equalsIgnoreCase(room.getStatus())) {
            throw new IllegalArgumentException(
                    "Selected room is not available"
            );
        }

        if (booking.getBookingStatus() == null
                || booking.getBookingStatus().isBlank()) {
            booking.setBookingStatus("confirmed");
        }

        Booking savedBooking = bookingRepository.save(booking);

        room.setStatus("booked");
        roomRepository.save(room);

        return savedBooking;
    }
}