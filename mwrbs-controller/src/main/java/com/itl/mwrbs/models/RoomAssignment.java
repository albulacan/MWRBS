package com.itl.mwrbs.models;

public class RoomAssignment {
	
	private long reservationDetailId;
	private long roomMasterId;
	private String roomName;

	public long getReservationDetailId() {
		return reservationDetailId;
	}
	public void setReservationDetailId(long reservationDetailId) {
		this.reservationDetailId = reservationDetailId;
	}
	public long getRoomMasterId() {
		return roomMasterId;
	}
	public void setRoomMasterId(long roomMasterId) {
		this.roomMasterId = roomMasterId;
	}
	public String getRoomName() {
		return roomName;
	}
	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}

}
